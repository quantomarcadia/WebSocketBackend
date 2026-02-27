import pool from '../config/db.js';

async function saveMessage(username, message) {
  const result = await pool.query(
    "INSERT INTO messages (username, message) VALUES ($1, $2) RETURNING *",
    [username, message]
  );

  return result.rows[0];
}

async function getRecentMessages(limit = 50) {
  const result = await pool.query(
    "SELECT * FROM messages ORDER BY created_at DESC LIMIT $1",
    [limit]
  );

  return result.rows;
}

export { saveMessage, getRecentMessages };