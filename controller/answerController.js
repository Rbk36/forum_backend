// controllers/answerController.js
import { StatusCodes } from "http-status-codes";
import dbConnection from "../config/dbConfig.js";

export async function getAnswer(req, res) {
  const { questionid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `SELECT a.answerid,
              a.userid AS answer_userid,
              a.answer,
              a.createdAt,
              u.username
       FROM answers a
       INNER JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?`,
      [questionid]
    );
    return res.status(StatusCodes.OK).json({ answers: rows });
  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
    });
  }
}

export async function postAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  if (!answer || !questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer and questionid are required",
    });
  }

  const currentDate = new Date();
  // adjust if needed for UTC+3 etc.
  const formattedTimestamp = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [userid, questionid, answer, createdAt]
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (err) {
    console.error("❌ Error posting answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
      detail: err.message,
    });
  }
}

export async function editAnswer(req, res) {
  const { answerid } = req.params;
  const { answer } = req.body;
  const currentUserId = req.user.userid;

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer text is required",
    });
  }

  try {
    const [rows] = await dbConnection.query(
      "SELECT userid FROM answers WHERE answerid = ?",
      [answerid]
    );
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }
    if (rows[0].userid !== currentUserId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Not authorized to edit this answer",
      });
    }

    await dbConnection.query(
      "UPDATE answers SET answer = ? WHERE answerid = ?",
      [answer, answerid]
    );
    return res.status(StatusCodes.OK).json({
      message: "Answer updated successfully",
    });
  } catch (err) {
    console.error("❌ Error editing answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
}

export async function deleteAnswer(req, res) {
  const { answerid } = req.params;
  const currentUserId = req.user.userid;

  try {
    const [rows] = await dbConnection.query(
      "SELECT userid FROM answers WHERE answerid = ?",
      [answerid]
    );
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }
    if (rows[0].userid !== currentUserId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Not authorized to delete this answer",
      });
    }

    await dbConnection.query("DELETE FROM answers WHERE answerid = ?", [
      answerid,
    ]);
    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
}
