// const mysql2 = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();

// const dbConnection = mysql2.createConnection({
//   user: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASS,
//   connectionLimit: process.env.DB_CONNECTION_LIMIT,
//   port: 3306,
// });

// dbConnection.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     return;
//   }
//   console.log("Connected to Clever Cloud MySQL database");
// });

// module.exports = dbConnection.promise();
// ./config/dbConfig.js
const mysql2 = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  port: Number(process.env.DB_PORT) || 3306,
});

module.exports = pool.promise();
