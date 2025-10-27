// controllers/aiController.js
const GoogleGenerativeAI = require("@google/genai");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");
const dotenv = require("dotenv");
dotenv.config();
const gemini = new GoogleGenerativeAI({
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
    // Fetch question details from the database
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

    // Generate AI response
    const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(fullPrompt);
    const aiAnswerText = response.text.trim();

    // Insert AI-generated answer into the database
    const aiUserId = process.env.AI_USER_ID || 0; // Ensure this user exists or handle appropriately
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [aiUserId, questionid, aiAnswerText, currentTimestamp]
    );

    res.status(StatusCodes.CREATED).json({
      message: "AI answer posted successfully.",
      answer: aiAnswerText,
    });
  } catch (error) {
    console.error("Error generating AI answer:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to generate AI answer.",
      error: error.message,
    });
  }
};
