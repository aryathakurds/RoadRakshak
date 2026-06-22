const express = require("express");

const {
  protect,
  allowRoles,
} = require("../middleware/auth");

const {
  getAuthorities,
  getAuthorityById,
  matchAuthority,
  createAuthority,
  updateAuthority,
  deleteAuthority,
} = require("../controllers/authorityController");

const router = express.Router();

router.get("/", getAuthorities);
router.get("/match", matchAuthority);
router.get("/:id", getAuthorityById);

router.post(
  "/",
  protect,
  allowRoles("admin"),
  createAuthority
);

router.patch(
  "/:id",
  protect,
  allowRoles("admin"),
  updateAuthority
);

router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  deleteAuthority
);

module.exports = router;