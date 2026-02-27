import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/me", verifyToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username
  });
});

export default authRouter;