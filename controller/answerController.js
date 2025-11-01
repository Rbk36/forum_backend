// controllers/answerController.js
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig.js");

async function getAnswer(req, res) {
  const { questionid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `SELECT a.answerid,
              a.userid AS userid,
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

async function postAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  if (!answer || !questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer and questionid are required",
    });
  }

  const currentDate = new Date();
  const formattedTimestamp = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    const [result] = await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [userid, questionid, answer, formattedTimestamp]
    );
    if (result.affectedRows === 1) {
      return res.status(StatusCodes.CREATED).json({
        message: "Answer posted successfully",
      });
    } else {
      // Should rarely happen, but handle gracefully
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to post answer",
      });
    }
  } catch (err) {
    console.error("❌ Error posting answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, please try again later",
      detail: err.message,
    });
  }
}

async function deleteAnswer(req, res) {
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

    const [deleteResult] = await dbConnection.query(
      "DELETE FROM answers WHERE answerid = ?",
      [answerid]
    );

    if (deleteResult.affectedRows === 1) {
      return res.status(StatusCodes.OK).json({
        message: "Answer deleted successfully",
      });
    } else {
      // If affectedRows is 0 (should not happen if row existed & matched), handle
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found or already deleted",
      });
    }
  } catch (err) {
    console.error("❌ Error deleting answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getAnswer,
  postAnswer,
  deleteAnswer,
  // if you still have editAnswer you can export it, else remove
};
