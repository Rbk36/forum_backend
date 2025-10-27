// routes/aiAnswerRoute.js
import express from "express";
import { GoogleGenAI } from "@google/genai";
import { StatusCodes } from "http-status-codes";

const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const router = express.Router();

async function generateResponse(req, res) {
  const { questionid, prompt } = req.body;

  if (!questionid || !prompt) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "questionid and prompt are required",
    });
  }

  try {
    // 1. Fetch the question details from the database
    const [qRows] = await dbConnection.query(
      "SELECT title, description FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (qRows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }
    const question = qRows[0];

    // 2. Build the prompt / context
    const fullPrompt = `
      Question Title: ${question.title}
      Description: ${question.description}

      Please answer the following:
      ${prompt}
    `;

    // 3. Call Gemini via Google Gen AI SDK
    const model = aiClient.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(fullPrompt);
    const aiAnswerText = response.text.trim();

    // 4. Insert answer into 'answers' table
    const currentTimestamp = new Date();
    const adjustedDate = new Date(
      currentTimestamp.getTime() + 3 * 60 * 60 * 1000
    );
    const formattedTimestamp = adjustedDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const aiUserId = process.env.AI_USER_ID || 0;
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [aiUserId, questionid, aiAnswerText, formattedTimestamp]
    );

    // 5. Respond to client
    return res.status(StatusCodes.CREATED).json({
      message: "AI answer posted successfully",
      answer: aiAnswerText,
    });
  } catch (err) {
    console.error("Error generating AI answer:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to generate AI answer",
      error: err.message,
    });
  }
}

router.post("/ai/answer", generateResponse);

export default router;
