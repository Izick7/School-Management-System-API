const express = require("express");

const { register, login } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authLimiter, registerValidator, validate, register);
router.post("/login", authLimiter, loginValidator, validate, login);

module.exports = router;