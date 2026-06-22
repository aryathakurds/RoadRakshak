const jwt = require("jsonwebtoken");
const User = require("../models/User");

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

const normalizeName = (name) => {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ");
};

const createToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const publicUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
};

const validateSignup = ({
  name,
  email,
  password,
}) => {
  if (!name || name.length < 2) {
    return "Name must contain at least 2 characters";
  }

  if (name.length > 80) {
    return "Name cannot exceed 80 characters";
  }

  if (!emailPattern.test(email)) {
    return "Enter a valid email address";
  }

  if (!passwordPattern.test(password)) {
    return (
      "Password must be 8-72 characters and include " +
      "an uppercase letter, lowercase letter and number"
    );
  }

  return "";
};

const signup = async (request, response) => {
  try {
    const name = normalizeName(request.body.name);
    const email = normalizeEmail(request.body.email);
    const password = String(
      request.body.password || ""
    );

    const validationError = validateSignup({
      name,
      email,
      password,
    });

    if (validationError) {
      return response.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "citizen",
    });

    response.status(201).json({
      success: true,
      message: "Account created",
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    response.status(400).json({
      success: false,
      message:
        error.message || "Unable to create account",
    });
  }
};

const login = async (request, response) => {
  try {
    const email = normalizeEmail(request.body.email);
    const password = String(
      request.body.password || ""
    );

    if (!emailPattern.test(email) || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (
      !user ||
      !(await user.comparePassword(password))
    ) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    response.status(200).json({
      success: true,
      message: "Login successful",
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message:
        error.message || "Unable to sign in",
    });
  }
};

const getCurrentUser = async (
  request,
  response
) => {
  response.status(200).json({
    success: true,
    user: publicUser(request.user),
  });
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};