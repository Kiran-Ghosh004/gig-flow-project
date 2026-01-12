import Gig from "../models/Gig.js";

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all open gigs (with search)
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const gigs = await Gig.find({
      status: "open",
      ...keyword,
    }).populate("ownerId", "name email");

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
