// routes/questionRoute.js
import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  postQuestion,
  editQuestion,
  deleteQuestion,
} from "../controller/questionController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all questions
router.get("/", authenticateUser, getAllQuestions);

// Get a single question by ID
router.get("/:questionid", authenticateUser, getQuestionById);

// Post a new question
router.post("/", authenticateUser, postQuestion);

// Edit a question (only the user who posted it)
router.patch("/:questionid", authenticateUser, editQuestion);

// Delete a question (only the user who posted it)
router.delete("/:questionid", authenticateUser, deleteQuestion);

export default router;
