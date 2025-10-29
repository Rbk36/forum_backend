import express from "express";
import { generateAIAnswer } from "../controller/aiController.js";
import authenticateUser from "../middleware/authMiddleware.js"; // assume you have this

const router = express.Router();

// Only authenticated user can request AI answer
router.post("/api/v1/ai/answer", authenticateUser, generateAIAnswer);

export default router;
