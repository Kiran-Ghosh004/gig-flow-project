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

// @desc    Get gigs created by logged-in user
// @route   GET /api/gigs/my
// @access  Private
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({
      ownerId: req.user._id,
    });

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// @desc    Get single gig by ID
// @route   GET /api/gigs/:id
// @access  Public / Private (both ok)
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("ownerId", "name email");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
