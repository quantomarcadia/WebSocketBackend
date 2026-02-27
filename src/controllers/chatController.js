import { getRecentMessages } from "../services/chatService.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await getRecentMessages(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};