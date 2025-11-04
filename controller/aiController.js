// controllers/aiController.js
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig.js");

const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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

    // 2. Build the AI prompt
    const fullPrompt = `
Question Title: ${question.title}
Description: ${question.description}

Please answer the following:
${prompt}
    `;

    // 3. Call the AI model to generate answer
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const aiAnswerText = (response.text || "").trim();
    if (!aiAnswerText) {
      throw new Error("AI returned empty answer text");
    }

    // 4. Just return the generated answer (do NOT post it)
    return res.status(StatusCodes.OK).json({
      message: "AI answer generated successfully.",
      answer: aiAnswerText,
    });
  } catch (error) {
    console.error("Error generating AI answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to generate AI answer.",
      error: error.message,
    });
  }
};

module.exports = { generateAIAnswer };
