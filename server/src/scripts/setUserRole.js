const dns = require("node:dns");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const allowedRoles = [
  "citizen",
  "moderator",
  "authority",
  "admin",
];

const setUserRole = async () => {
  try {
    const email = String(process.argv[2] || "")
      .trim()
      .toLowerCase();

    const role = String(process.argv[3] || "")
      .trim()
      .toLowerCase();

    if (!email || !role) {
      throw new Error(
        "Usage: node src/scripts/setUserRole.js user@example.com admin"
      );
    }

    if (!allowedRoles.includes(role)) {
      throw new Error(
        `Invalid role. Use one of: ${allowedRoles.join(", ")}`
      );
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected");

    const user = await User.findOneAndUpdate(
      { email },
      { role },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      throw new Error(`No user found with email: ${email}`);
    }

    console.log("User role updated successfully");
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error("Unable to update user role:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

setUserRole();