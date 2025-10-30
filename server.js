require("dotenv/config");
const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConfig.js");

const userRoutes = require("./routes/userRoutes.js");
const questionRoutes = require("./routes/questionRoute.js");
const answerRoutes = require("./routes/answerRoute.js");
const aiRoutes = require("./routes/aiAnswerRoute.js");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Register routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1", aiRoutes);

async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    console.log("✅ Database connected successfully");
    app.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
}

start();
