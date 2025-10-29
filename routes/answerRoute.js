import express from "express";
const router = express.Router();

// 1. Importing controllers
import { getAnswer, postAnswer } from "../controller/answerController.js";

// 2. Importing middleware
import authMiddleware from "../middleware/authMiddleware.js";

// Get Answers for a Question
router.get("/answer/:question_id", getAnswer);

// Post Answers for a Question
router.post("/answer", authMiddleware, postAnswer);

export default router;
