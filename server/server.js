const dns = require("node:dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require(
  "./src/config/database"
);

const reportRoutes = require(
  "./src/routes/reportRoutes"
);

const locationRoutes = require(
  "./src/routes/locationRoutes"
);

const authRoutes = require(
  "./src/routes/authRoutes"
);

const authorityRoutes = require(
  "./src/routes/authorityRoutes"
);

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
  })
);

app.use(express.json({
  limit: "1mb",
}));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    message:
      "RoadRakshak API is running",
  });
});

app.get(
  "/api/health",
  (request, response) => {
    response.status(200).json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/locations",
  locationRoutes
);

app.use(
  "/api/authorities",
  authorityRoutes
);

app.use(
  (request, response) => {
    response.status(404).json({
      success: false,
      message: "API route not found",
    });
  }
);

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `RoadRakshak server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Unable to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();