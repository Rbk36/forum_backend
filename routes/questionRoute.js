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

// Post a new question
router.post("/", authenticateUser, postQuestion);

// Edit a question (only the user who posted it)
router.patch("/:questionid", authenticateUser, editQuestion);

// Delete a question (only the user who posted it)
router.delete("/:questionid", authenticateUser, deleteQuestion);

export default router;
