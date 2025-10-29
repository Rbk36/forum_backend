// controllers/questionController.js
import { StatusCodes } from "http-status-codes";
import dbConnection from "../config/dbConfig.js";

export async function getAllQuestions(req, res) {
  try {
    const [rows] = await dbConnection.query(
      "SELECT questionid, userid, title, description, createdAt FROM questions ORDER BY createdAt DESC"
    );
    return res.status(StatusCodes.OK).json({ questions: rows });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong fetching questions.",
    });
  }
}

export async function getQuestionById(req, res) {
  const { questionid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      "SELECT questionid, userid, title, description, createdAt FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found." });
    }
    return res.status(StatusCodes.OK).json({ question: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching question:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong fetching the question.",
    });
  }
}

export async function postQuestion(req, res) {
  const { userid, title, description } = req.body;

  if (!userid || !title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "userid, title & description are required.",
    });
  }

  const currentDate = new Date();
  const adjusted = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);
  const createdAt = adjusted.toISOString().slice(0, 19).replace("T", " ");

  try {
    const [result] = await dbConnection.query(
      "INSERT INTO questions (userid, title, description, createdAt) VALUES (?, ?, ?, ?)",
      [userid, title, description, "", createdAt]
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully.",
      questionId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error creating question:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong creating the question.",
    });
  }
}

export async function editQuestion(req, res) {
  const { questionid } = req.params;
  const { title, description } = req.body;
  const currentUserId = req.user.userid;

  try {
    const [rows] = await dbConnection.query(
      "SELECT userid FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found." });
    }
    if (rows[0].userid !== currentUserId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized to edit this question." });
    }

    await dbConnection.query(
      "UPDATE questions SET title = ?, description = ? WHERE questionid = ?",
      [title, description, questionid]
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "Question updated successfully." });
  } catch (err) {
    console.error("❌ Error editing question:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong updating the question." });
  }
}

export async function deleteQuestion(req, res) {
  const { questionid } = req.params;
  const currentUserId = req.user.userid;

  try {
    const [rows] = await dbConnection.query(
      "SELECT userid FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found." });
    }
    if (rows[0].userid !== currentUserId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized to delete this question." });
    }

    await dbConnection.query("DELETE FROM questions WHERE questionid = ?", [
      questionid,
    ]);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Question deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong deleting the question." });
  }
}
