const express = require("express");
const router = express.Router();

const {
  getAnswer,
  postAnswer,
  deleteAnswer,
} = require("../controllers/answerController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

// Get answers for a question: GET /api/v1/answer/:questionid
router.get("/answer/:questionid", getAnswer);

// Post a new answer: POST /api/v1/answer
router.post("/answer", authMiddleware, postAnswer);

// Delete an answer: DELETE /api/v1/answer/:answerid
router.delete("/answer/:answerid", authMiddleware, deleteAnswer);

module.exports = router;
