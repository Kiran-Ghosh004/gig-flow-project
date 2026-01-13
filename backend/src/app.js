import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";

const app = express();

// 🔥 REQUIRED FOR HTTPS COOKIES ON RENDER
app.set("trust proxy", 1);

app.use(express.json());

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

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
