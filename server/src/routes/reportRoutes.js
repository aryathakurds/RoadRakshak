const express = require("express");

const upload = require(
  "../middleware/upload"
);

const resolveAuthority = require(
  "../middleware/resolveAuthority"
);

const {
  protect,
  allowRoles,
} = require("../middleware/auth");

const {
  getReports,
  getMyReports,
  getReportById,
  createReport,
  updateReport,
  resolveReport,
  deleteReport,
} = require(
  "../controllers/reportController"
);

const router = express.Router();

router.get("/", getReports);

router.get(
  "/mine",
  protect,
  getMyReports
);

router.get(
  "/:id",
  getReportById
);

router.post(
  "/",
  protect,
  upload.single("photo"),
  resolveAuthority,
  createReport
);

router.patch(
  "/:id",
  protect,
  allowRoles(
    "moderator",
    "authority",
    "admin"
  ),
  updateReport
);

router.post(
  "/:id/resolve",
  protect,
  allowRoles(
    "moderator",
    "authority",
    "admin"
  ),
  upload.single("evidence"),
  resolveReport
);

router.delete(
  "/:id",
  protect,
  deleteReport
);

module.exports = router;