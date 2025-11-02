// // // const dotenv = require("dotenv");
// // // dotenv.config();
// // // const express = require("express");
// // // const cors = require("cors");
// // // const dbConnection = require("./config/dbConfig.js");

// // // const userRoutes = require("./routes/userRoutes.js");
// // // const questionRoutes = require("./routes/questionRoute.js");
// // // const answerRoutes = require("./routes/answerRoute.js");
// // // const aiRoutes = require("./routes/aiAnswerRoute.js");

// // // const port = process.env.PORT || 5000;
// // // const app = express();

// // // app.use(express.json());

// // // app.use(
// // //   cors({
// // //     origin: ["https://forum-backend-6-jiwq.onrender.com"],
// // //   })
// // // );

// // // // Register routes
// // // app.use("/api/v1/user", userRoutes);
// // // app.use("/api/v1", questionRoutes);
// // // app.use("/api/v1", answerRoutes);
// // // app.use("/api/v1", aiRoutes);

// // // async function start() {
// // //   try {
// // //     await dbConnection.execute("SELECT 'test'");
// // //     console.log("✅ Database connected successfully");
// // //     app.listen(port, "0.0.0.0", () =>
// // //       console.log(`🚀 Server running at http://localhost:${port}`)
// // //     );
// // //   } catch (err) {
// // //     console.error("❌ Failed to start server:", err.message);
// // //   }
// // // }

// // // start();
// // const dotenv = require("dotenv");
// // dotenv.config();
// // const express = require("express");
// // const cors = require("cors");
// // const dbConnection = require("./config/dbConfig.js");

// // const userRoutes = require("./routes/userRoutes.js");
// // const questionRoutes = require("./routes/questionRoute.js");
// // const answerRoutes = require("./routes/answerRoute.js");
// // const aiRoutes = require("./routes/aiAnswerRoute.js");

// // const app = express();

// // const port = process.env.PORT;
// // if (!port) {
// //   console.error("❌ PORT not defined");
// //   process.exit(1);
// // }
// // app.use(express.json());

// // app.use(
// //   cors({
// //     origin: ["https://papaya-lebkuchen-bc893b.netlify.app/"],
// //   })
// // );

// // // Register routes
// // app.use("/api/v1/user", userRoutes);
// // app.use("/api/v1", questionRoutes);
// // app.use("/api/v1", answerRoutes);
// // app.use("/api/v1", aiRoutes);

// // async function start() {
// //   try {
// //     await dbConnection.execute("SELECT 'test'");
// //     console.log("✅ Database connected successfully");

// //     app.listen(port, () => console.log(`🚀 Server running at port ${port}`));
// //   } catch (err) {
// //     console.error("❌ Failed to start server:", err.message);
// //     process.exit(1);
// //   }
// // }

// // (async () => {
// //   try {
// //     const [rows] = await pool.query("SELECT NOW() AS current_time");
// //     console.log("✅ MySQL is working! Current time:", rows[0].current_time);
// //     process.exit();
// //   } catch (err) {
// //     console.error("❌ Test query failed:", err.message);
// //   }
// // })();
// // start();

// // const dotenv = require("dotenv");
// // dotenv.config();

// // const express = require("express");
// // const cors = require("cors");
// // const dbConnection = require("./config/dbConfig.js");

// // const userRoutes = require("./routes/userRoutes.js");
// // const questionRoutes = require("./routes/questionRoute.js");
// // const answerRoutes = require("./routes/answerRoute.js");
// // const aiRoutes = require("./routes/aiAnswerRoute.js");

// // const app = express();

// // const port = process.env.PORT || 3000;
// // if (!process.env.PORT) {
// //   console.warn("⚠️  No PORT env var defined, defaulting to 3000");
// // }

// // app.use(express.json());

// // app.use(
// //   cors({
// //     origin: ["https://papaya-lebkuchen-bc893b.netlify.app"],
// //     // credentials: true, // if you need cookies/auth
// //   })
// // );

// // // Register routes
// // app.use("/api/v1/user", userRoutes);
// // app.use("/api/v1", questionRoutes);
// // app.use("/api/v1", answerRoutes);
// // app.use("/api/v1", aiRoutes);

// // async function start() {
// //   try {
// //     // Test database connection with a simple query
// //     await dbConnection.execute("SELECT 1");
// //     console.log("✅ Database connected successfully");

// //     app.listen(port, () => {
// //       console.log(`🚀 Server running on http://localhost:${port}`);
// //     });
// //   } catch (err) {
// //     console.error("❌ Failed to start server:", err.message);
// //     process.exit(1);
// //   }
// // }

// // start();
// // server.js
// // server.js
// const dotenv = require("dotenv");
// dotenv.config();

// const express = require("express");
// const cors = require("cors");
// const dbConnection = require("./config/dbConfig.js");

// const userRoutes = require("./routes/userRoutes.js");
// const questionRoutes = require("./routes/questionRoute.js");
// const answerRoutes = require("./routes/answerRoute.js");
// const aiRoutes = require("./routes/aiAnswerRoute.js");

// const app = express();

// const port = process.env.PORT || 3000;
// if (!process.env.PORT) {
//   console.warn("⚠️  No PORT env var defined, defaulting to 3000");
// }

// // Middleware
// app.use(express.json());

// // CORS setup
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://papaya-lebkuchen-bc893b.netlify.app",
// ];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true); // allow tools or same‑origin
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// // Routes
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1", answerRoutes);
// app.use("/api/v1", aiRoutes);

// async function start() {
//   try {
//     await dbConnection.execute("SELECT 1");
//     console.log("✅ Database connected successfully");

//     app.listen(port, () => {
//       console.log(`🚀 Server running at http://localhost:${port}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to start server:", err.message);
//     process.exit(1);
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

const port = process.env.PORT || 3000;
if (!process.env.PORT) {
  console.warn("⚠️  No PORT env var defined, defaulting to 3000");
}

app.use(express.json());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://papaya-lebkuchen-bc893b.netlify.app",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // enable preflight for all routes

// Register routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", answerRoutes);
app.use("/api/v1", aiRoutes);

async function start() {
  try {
    await dbConnection.execute("SELECT 1");
    console.log("✅ Database connected successfully");
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
