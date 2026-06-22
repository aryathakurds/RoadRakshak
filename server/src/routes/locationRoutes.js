const express = require("express");
const {
  searchLocations,
  getLocations,
  createLocation,
} = require("../controllers/locationController");

const router = express.Router();

router.get("/search", searchLocations);
router.get("/", getLocations);
router.post("/", createLocation);

module.exports = router;