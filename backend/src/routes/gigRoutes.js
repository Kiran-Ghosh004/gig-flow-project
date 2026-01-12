import express from "express";
import { createGig, getGigs } from "../controllers/gigController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createGig)
  .get(getGigs);

export default router;
