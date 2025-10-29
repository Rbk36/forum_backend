// authMiddleware.js
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    req.user = {
      userid: decoded.userid,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authenticateUser;
