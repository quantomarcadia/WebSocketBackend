import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export async function registerUser(username, email, password) {
    if (!username || !email || !password)
    throw new Error("All fields required");

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email",
    [username, email, hashed]
  );

  return result.rows[0];
}

export async function loginUser(email, password) {
    if (!email || !password)
    throw new Error("Email and password required");
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
}