// server/routes/answerRoutes.js (or whatever the path is)

import express from "express";
import { getAnswer, postAnswer } from "../controller/answerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get Answers for a Question
router.get("/answer/:question_id", getAnswer);

// Post Answers for a Question
router.post("/answer", authMiddleware, postAnswer);

export default router;
