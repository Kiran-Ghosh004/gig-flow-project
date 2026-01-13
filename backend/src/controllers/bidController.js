import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import mongoose from "mongoose";

import { getIO } from "../config/socket.js";

// @desc    Submit a bid on a gig
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Prevent bidding on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot bid on your own gig",
      });
    }

    // Prevent bidding if gig already assigned
    if (gig.status !== "open") {
      return res.status(400).json({
        message: "Bidding is closed for this gig",
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// @desc    Get all bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Gig owner only)
export const getBidsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only gig owner can see bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view bids for this gig",
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email");

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Hire a freelancer for a bid
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig owner only)
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only gig owner can hire
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not authorized to hire" });
    }

    // Gig must be open
    if (gig.status !== "open") {
      await session.abortTransaction();
      return res.status(400).json({
        message: "This gig is already assigned",
      });
    }

    // 1. Mark selected bid as hired
    bid.status = "hired";
    await bid.save({ session });

    // 2. Reject all other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    // 3. Update gig status
    gig.status = "assigned";
    await gig.save({ session });

    // ✅ COMMIT TRANSACTION
    await session.commitTransaction();

    // 🔔 SOCKET.IO EMIT (ADD THIS PART)
    const io = getIO();
    io.to(bid.freelancerId.toString()).emit("hired", {
      message: `You have been hired for "${gig.title}"`,
      gigId: gig._id,
      bidId: bid._id,
    });

    // 4. Response
    res.status(200).json({
      message: "Freelancer hired successfully",
      hiredBid: bid,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};



// @desc    Get bids placed by logged-in freelancer
// @route   GET /api/bids/my
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({
      freelancerId: req.user._id,
    })
      .populate("gigId", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    console.error("GET MY BIDS ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

