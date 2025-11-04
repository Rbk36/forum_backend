const express = require("express");
const router = express.Router();

// 1. Importing controllers
const {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
} = require("../controller/questionController.js");

// 2. Importing  middleware
const authMiddleware = require("../middleware/authMiddleware.js");

// get all questions
router.get("/questions", getAllQuestions);

// get single question
router.get("/question/:questionId", getQuestionAndAnswer);

// post a question
router.post("/question", authMiddleware, postQuestion);

module.exports = router;
