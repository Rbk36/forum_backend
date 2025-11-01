const express = require("express");
const router = express.Router();
const {
  getAnswer,
  postAnswer,
  editAnswer,
  deleteAnswer,
} = require("../controllers/answerController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// get answers for a question
router.get("/answer/:questionid", getAnswer);

// post a new answer
router.post("/answer", authMiddleware, postAnswer);

// edit an answer
router.put("/answer/:answerid", authMiddleware, editAnswer);

// delete an answer
router.delete("/answer/:answerid", authMiddleware, deleteAnswer);

module.exports = router;
