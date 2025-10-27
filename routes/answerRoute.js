const express = require("express");
const { getAnswer, postAnswer } = require("../controller/answerController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Get Answers for a Question
router.get("/answer/:question_id", getAnswer);

// Post Answers for a Question
router.post("/answer",authMiddleware, postAnswer);

module.exports = router;
