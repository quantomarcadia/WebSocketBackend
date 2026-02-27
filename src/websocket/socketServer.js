import { WebSocketServer } from "ws";
import handleConnection from "./socketHandler.js";

function initializeWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    handleConnection(ws, wss);
  });

  console.log("WebSocket initialized");
}

export default initializeWebSocket;