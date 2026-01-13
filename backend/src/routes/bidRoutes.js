import express from "express";
import {
  createBid,
  getBidsForGig,
  hireBid,
  getMyBids,
} from "../controllers/bidController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Place bid
router.post("/", protect, createBid);

// 🔑 Freelancer dashboard — My Bids
router.get("/my", protect, getMyBids);

// Client view — Bids for a gig
router.get("/:gigId", protect, getBidsForGig);

// Hire freelancer
router.patch("/:bidId/hire", protect, hireBid);

export default router;
