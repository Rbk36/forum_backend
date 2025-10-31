// const express = require("express");
// const router = express.Router();
// const { register, login, check } = require("../controller/usercontroller.js");
// // authentication middleware
// const authMiddleware = require("../middleware/authMiddleware.js");

// // register route
// router.post("/register", register);

// // login users
// router.post("/login", login);

// //check users
// router.get("/check", authMiddleware, check);

// module.exports = router;
// ./routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { register, login, check } = require("../controller/usercontroller.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// POST /api/v1/user/register
router.post("/register", register);

// POST /api/v1/user/login
router.post("/login", login);

// GET /api/v1/user/check (protected)
router.get("/check", authMiddleware, check);

module.exports = router;
