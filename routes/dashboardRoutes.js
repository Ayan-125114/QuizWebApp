const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { studentDashboard , teacherDashboard , adminDashboard } = require("../controllers/dashboardController");
// const { adminOnly } = require("../middleware/authMiddleware");

router.get(
  "/student",
  protect,
  studentDashboard
);

router.get(
  "/teacher",
  protect,
  teacherDashboard
);

router.get(
  "/admin",
  protect,
  // adminOnly,
  adminDashboard
);

module.exports = router;