import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Init Socket.io
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
