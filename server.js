// const dotenv = require("dotenv");
// dotenv.config();
// const express = require("express");
// const cors = require("cors");
// const dbConnection = require("./config/dbConfig.js");

// const userRoutes = require("./routes/userRoutes.js");
// const questionRoutes = require("./routes/questionRoute.js");
// const answerRoutes = require("./routes/answerRoute.js");
// const aiRoutes = require("./routes/aiAnswerRoute.js");

// const port = process.env.PORT || 5000;
// const app = express();

// app.use(express.json());

// app.use(
//   cors({
//     origin: ["https://forum-backend-6-jiwq.onrender.com"],
//   })
// );

// // Register routes
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", questionRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1", aiRoutes);

// async function start() {
//   try {
//     await dbConnection.execute("SELECT 'test'");
//     console.log("✅ Database connected successfully");
//     app.listen(port, "0.0.0.0", () =>
//       console.log(`🚀 Server running at http://localhost:${port}`)
//     );
//   } catch (err) {
//     console.error("❌ Failed to start server:", err.message);
//   }
// }

// start();
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConfig.js");

const userRoutes = require("./routes/userRoutes.js");
const questionRoutes = require("./routes/questionRoute.js");
const answerRoutes = require("./routes/answerRoute.js");
const aiRoutes = require("./routes/aiAnswerRoute.js");

const app = express();

const port = process.env.PORT;
if (!port) {
  console.error("❌ PORT not defined");
  process.exit(1);
}
app.use(express.json());

app.use(
  cors({
    origin: ["https://papaya-lebkuchen-bc893b.netlify.app/"],
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

    app.listen(port, "0.0.0.0", () =>
      console.log(`🚀 Server running at port ${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
