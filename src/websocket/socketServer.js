import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import handleConnection from "./socketHandler.js";


function initializeWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded; 
      handleConnection(ws, wss);
    } catch (err) {
      ws.close();
    }
  });

  console.log("WebSocket initialized with JWT auth");
}

export default initializeWebSocket;