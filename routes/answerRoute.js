// // routes/answerRoute.js
// import express from "express";
// import {
//   getAnswers,
//   postAnswer,
//   editAnswer,
//   deleteAnswer,
// } from "../controller/answerController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // GET answers for a question
// router.get("/answers/:questionid", authMiddleware, getAnswers);

// // POST a new answer
// router.post("/answer", authMiddleware, postAnswer);

// // PATCH edit answer (owner only)
// router.patch("/answer/:answerid", authMiddleware, editAnswer);

// // DELETE answer (owner only)
// router.delete("/answer/:answerid", authMiddleware, deleteAnswer);

// export default router;
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

// Get all answers for a specific question
router.get("/answers/:question_id", authMiddleware, getAnswer);

// Post a new answer to a question
router.post("/answer", authMiddleware, postAnswer);

export default router;
