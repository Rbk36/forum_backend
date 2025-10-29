import express from "express";
const router = express.Router();

// 1. Importing controllers
import {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
} from "../controller/questionController.js";

// 2. Importing  middleware
import authMiddleware from "../middleware/authMiddleware.js";

// get all questions
router.get("/questions", getAllQuestions);

// get single question
router.get("/question/:questionId", getQuestionAndAnswer);

// post a question
router.post("/question", authMiddleware, postQuestion);

export default router;
