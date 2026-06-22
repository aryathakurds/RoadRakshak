const express = require("express");
const { rateLimit } = require("express-rate-limit");

const {
  signup,
  login,
  getCurrentUser,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/auth");

const router = express.Router();

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many account creation attempts. Please try again later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message:
      "Too many login attempts. Please wait before trying again.",
  },
});

router.post(
  "/signup",
  signupLimiter,
  signup
);

router.post(
  "/login",
  loginLimiter,
  login
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

module.exports = router;