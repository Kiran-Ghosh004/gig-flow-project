import express from "express";
import {
  createGig,
  getGigs,
  getMyGigs,
  getGigById,
} from "../controllers/gigController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create gig (client)
router.post("/", protect, createGig);

// Get all open gigs (freelancer browse)
router.get("/", getGigs);

// Get gigs created by logged-in user (dashboard)
router.get("/my", protect, getMyGigs);

// 🚨 MUST BE LAST — Get single gig by ID (place bid page)
router.get("/:id", getGigById);

export default router;
