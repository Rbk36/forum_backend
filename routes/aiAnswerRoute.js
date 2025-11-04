const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");

// Suggest an AI-generated answer (user reviews & posts manually)
router.post("/suggest-ai-answer", aiController.generateAIAnswer);

module.exports = router;
