const router = require("../routes/answerRoute.js");

// controllers/aiController.js
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig.js");

const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // If you are using Vertex AI instead of the developer API:
  // vertexai: true,
  // project: process.env.GOOGLE_CLOUD_PROJECT,
  // location: process.env.GOOGLE_CLOUD_LOCATION,
});

const generateAIAnswer = async (req, res) => {
  const { questionid, prompt } = req.body;

  if (!questionid || !prompt) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Both 'questionid' and 'prompt' are required.",
    });
  }

  try {
    // 1. Verify the question exists
    const [qRows] = await dbConnection.query(
      "SELECT title, description FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (qRows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found.",
      });
    }

    const question = qRows[0];

    // 2. Verify the AI user exists (so foreign key constraint won't fail)
    const aiUserId = parseInt(process.env.AI_USER_ID, 10);
    if (isNaN(aiUserId)) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "AI_USER_ID is not configured properly.",
      });
    }

    const [userRows] = await dbConnection.query(
      "SELECT userid FROM users WHERE userid = ?",
      [aiUserId]
    );

    if (userRows.length === 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Configured AI user does not exist in users table.",
      });
    }

    // 3. Build full prompt
    const fullPrompt = `
Question Title: ${question.title}
Description: ${question.description}

Please answer the following:
${prompt}
    `;

    // 4. Call the AI model to generate answer
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash", // Ensure this model string is supported in your region/project
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      // (Optional) You may add config like temperature, maxOutputTokens here
    });

    const aiAnswerText = (response.text || "").trim();
    if (!aiAnswerText) {
      throw new Error("AI returned empty answer text");
    }

    // 5. Insert the AI-generated answer
    const currentTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer, createdAt) VALUES (?, ?, ?, ?)",
      [aiUserId, questionid, aiAnswerText, currentTimestamp]
    );

    // 6. Respond success
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
module.exports = { generateAIAnswer };
