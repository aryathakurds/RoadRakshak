const express = require("express");

const upload = require("../middleware/upload");

const { protect } = require("../middleware/auth");

const {
  generateRoadReport,
  analyzeRoadPhoto,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/generate-report", protect, generateRoadReport);

router.post(
  "/analyze-road-photo",
  protect,
  upload.single("photo"),
  analyzeRoadPhoto
);

module.exports = router;