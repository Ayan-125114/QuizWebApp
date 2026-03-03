const express = require("express");
const router = express.Router();
const { register , login} = require("../controllers/authController");
const { approveTeacher } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware"); // middleware

router.post("/register", register);
router.post("/login", login);


router.get("/test", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

router.put(
  "/admin/approve/:userId",
  protect,
  adminOnly,
  approveTeacher
);

module.exports = router;
