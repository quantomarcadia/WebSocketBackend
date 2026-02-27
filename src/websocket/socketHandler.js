import { WebSocket } from "ws";
import { saveMessage, getRecentMessages } from "../services/chatService.js";
import formatMessage from "../utils/messageFormatter.js";

const connectedUsers = new Map(); 
const userSessions = new Map();   

function handleConnection(ws, wss) {
  const username = ws.user.username;

  // =============================
  // Duplicate Login Check
  // =============================
  if (userSessions.has(username)) {
    ws.send(
      formatMessage("error", {
        message: "User already connected from another session",
      })
    );
    ws.close();
    return;
  }

  console.log(`${username} connected`);

  connectedUsers.set(ws, username);
  userSessions.set(username, ws);

  // =============================
  // Send chat history
  // =============================
  (async () => {
    try {
      const messages = await getRecentMessages(50);
      ws.send(formatMessage("history", { messages }));
    } catch (err) {
      console.error("History error:", err.message);
    }
  })();

  // =============================
  // Broadcast join
  // =============================
  broadcast(
    wss,
    formatMessage("system", {
      message: `${username} joined the chat`,
    })
  );

  broadcastUserList(wss);

  // =============================
  // Message handler
  // =============================
  ws.on("message", async (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      // Only allow chat type
      if (parsed.type !== "chat") return;

      const message = parsed.message?.trim();

      // =============================
      // Validation
      // =============================
      if (!message) {
        ws.send(
          formatMessage("error", {
            message: "Message cannot be empty",
          })
        );
        return;
      }

      if (message.length > 500) {
        ws.send(
          formatMessage("error", {
            message: "Message too long (max 500 chars)",
          })
        );
        return;
      }

      const saved = await saveMessage(username, message);

      broadcast(
        wss,
        formatMessage("chat", {
          username,
          message: saved.message,
          createdAt: saved.created_at,
        })
      );
    } catch (err) {
      ws.send(
        formatMessage("error", {
          message: "Invalid message format",
        })
      );
    }
  });

  // =============================
  // Disconnect
  // =============================
  ws.on("close", () => {
    console.log(`${username} disconnected`);

    connectedUsers.delete(ws);
    userSessions.delete(username);

    broadcast(
      wss,
      formatMessage("system", {
        message: `${username} left the chat`,
      })
    );

    broadcastUserList(wss);
  });
}

// =============================
// Broadcast helper
// =============================
function broadcast(wss, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// =============================
// Users list broadcast
// =============================
function broadcastUserList(wss) {
  const users = [...userSessions.keys()];

  broadcast(
    wss,
    formatMessage("users", {
      users,
      count: users.length,
    })
  );
}

export default handleConnection;