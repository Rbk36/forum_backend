// routes/answerRoute.js
import express from "express";
import {
  getAnswers,
  postAnswer,
  editAnswer,
  deleteAnswer,
} from "../controller/answerController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// GET answers for a question
router.get("/answers/:questionid", authenticateUser, getAnswers);

// POST a new answer
router.post("/answer", authenticateUser, postAnswer);

// PATCH edit answer (owner only)
router.patch("/answer/:answerid", authenticateUser, editAnswer);

// DELETE answer (owner only)
router.delete("/answer/:answerid", authenticateUser, deleteAnswer);

export default router;
