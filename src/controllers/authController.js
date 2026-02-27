import { registerUser, loginUser } from "../services/authService.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser(username, email, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}