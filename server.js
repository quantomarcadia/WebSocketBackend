
import express from "express";
import http from "http";
import pool from "./src/config/db.js";
import initializeWebSocket from "./src/websocket/socketServer.js";
import chatRouter from "./src/routes/chatRoutes.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/api/chat", chatRouter);

// Basic health check route (industry standard)
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (err) {
    res.status(500).json({ status: "Error", database: "Disconnected" });
  }
});

// Initialize WebSocket
initializeWebSocket(server);

// Start server
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});