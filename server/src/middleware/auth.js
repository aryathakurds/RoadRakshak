const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (request, response, next) => {
  try {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return response.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    request.user = user;
    next();
  } catch {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

const allowRoles = (...roles) => {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({
        success: false,
        message: "You do not have permission for this action",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  allowRoles,
};