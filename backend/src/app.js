import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";

const app = express();

// 🔴 REQUIRED for Render / HTTPS cookies
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());

// 🔴 SIMPLE + CORRECT CORS FOR COOKIES
app.use(
  cors({
    origin: "https://gig-flow-project-975g.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "GigFlow backend running",
  });
});

export default app;
