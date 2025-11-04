const express = require("express");
const router = express.Router();

// Controllers
const {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
} = require("../controller/questionController.js");

// Middleware
const authMiddleware = require("../middleware/authMiddleware.js");

// GET all questions (with optional pagination via query params page & limit)
router.get("/questions", getAllQuestions);

// GET a single question with its answers
router.get("/question/:questionId", getQuestionAndAnswer);

// POST a new question (authenticated)
router.post("/question", authMiddleware, postQuestion);

module.exports = router;
