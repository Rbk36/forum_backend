import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnection from "./config/dbConfig.js";

import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoute.js";
import answerRoutes from "./routes/answerRoute.js";
import aiRoutes from "./routes/aiAnswerRoute.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// Route prefixes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    console.log("✅ Database connected successfully");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
