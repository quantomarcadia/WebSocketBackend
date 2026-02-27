import { WebSocket } from "ws";
import { saveMessage, getRecentMessages } from "../services/chatService.js";
import formatMessage from "../utils/messageFormatter.js";

function handleConnection(ws, wss) {
  console.log("Client connected");

  // Send last messages on connect
  (async () => {
    try {
      const messages = await getRecentMessages();
      ws.send(formatMessage("history", { messages }));
    } catch (err) {
      console.error("Error sending history:", err.message);
    }
  })();

  ws.on("message", async (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      if (parsed.type === "chat") {
        const saved = await saveMessage(parsed.username, parsed.message);

        broadcast(
          wss,
          formatMessage("chat", {
            username: saved.username,
            message: saved.message,
            createdAt: saved.created_at,
          })
        );
      }
    } catch (err) {
      console.error("Message error:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
}

function broadcast(wss, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export default handleConnection;