// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const port = process.env.PORT || 5000;

// // DB connection
// const dbConnection = require("./config/dbConfig");

// // CORS
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//   })
// );

// // JSON parser
// app.use(express.json());

// // routes

// // user routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api/v1/user", userRoutes);

// // Question routes

// const questionRoutes = require("./routes/questionRoute");
// app.use("/api/v1", questionRoutes);

// // answer routes
// const answerRoutes = require("./routes/answerRoute");
// app.use("/api/v1", answerRoutes);

// // start server
// async function start() {
//   try {
//     await dbConnection.execute("SELECT 'test'");
//     console.log("Database connected successfully");
//     await app.listen(port);
//     console.log(`Server running at http://localhost:${port}`);
//   } catch (err) {
//     console.error(err.message);
//   }
// }

// start();
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { default as axiosInstance } from "../FrontEnd/src/utility/axios.js"; // Adjust the path as needed
import dbConnection from "./config/dbConfig.js"; // Adjust the path as needed
import userRoutes from "./routes/userRoutes.js"; // Adjust the path as needed
import questionRoutes from "./routes/questionRoute.js"; // Adjust the path as needed
import answerRoutes from "./routes/answerRoute.js"; // Adjust the path as needed
import aiAnswerRoutes from "./routes/aiAnswerRoute.js"; // Adjust the path as needed

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// DB connection
async function start() {
  try {
    await dbConnection.execute("SELECT 1");
    console.log("Database connected successfully");
    await app.listen(port);
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}

// Middleware
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1", aiAnswerRoutes);

// AI answer route
app.post("/ai/answer", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const response = await axiosInstance.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gemini-2.5-flash",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error generating AI answer:", error);
    res.status(500).json({ error: "Failed to generate AI answer" });
  }
});

start();
