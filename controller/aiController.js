// controllers/aiController.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { StatusCodes } from "http-status-codes";
import dbConnection from "../config/dbConfig.js";

// Initialize the client
const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIAnswer = async (req, res) => {
  const { questionid, prompt } = req.body;

  if (!questionid || !prompt) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Both 'questionid' and 'prompt' are required.",
    });
  }

  try {
    // Fetch question from DB
    const [rows] = await dbConnection.query(
      "SELECT title, description FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found.",
      });
    }

    const question = rows[0];
    const fullPrompt = `
Question Title: ${question.title}
Description: ${question.description}

Please answer the following:
${prompt}
    `;

    // Generate AI answer
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });
    const aiAnswerText = response.text.trim();

    // Insert into DB
    const aiUserId = process.env.AI_USER_ID || 0;
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [aiUserId, questionid, aiAnswerText, currentTimestamp]
    );

    // Return response
    return res.status(StatusCodes.CREATED).json({
      message: "AI answer posted successfully.",
      answer: aiAnswerText,
    });
  } catch (error) {
    console.error("Error generating AI answer:", error);
    if (error.stack) console.error("Stack:", error.stack);
    if (error.response)
      console.error("API Response error data:", error.response.data);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to generate AI answer.",
      error: error.message,
    });
  }
};
