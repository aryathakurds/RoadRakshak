const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

dotenv.config({
  override: true,
});

const reportRoutes = require("./src/routes/reportRoutes");
const locationRoutes = require("./src/routes/locationRoutes");
const authorityRoutes = require("./src/routes/authorityRoutes");
const authRoutes = require("./src/routes/authRoutes");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({
    success: true,
    message: "RoadRakshak API is running",
  });
});

app.get("/api/health", (request, response) => {
  response.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/authorities", authorityRoutes);
app.use("/api/ai", aiRoutes);

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: "API route not found",
  });
});

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("MongoDB Atlas connected");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`RoadRakshak server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();