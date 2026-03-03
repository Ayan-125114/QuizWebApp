const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { teacherOnly } = require("../middleware/authMiddleware");

const { getQuizBestResults , myBestResult , leaderboard , getMyResults , getQuizAttempts} = require("../controllers/resultController");

router.get(
  "/teacher/quiz-results/:quizId",
  protect,
  teacherOnly,
  getQuizBestResults
);

router.get(
  "/student/my-result/:quizId",
  protect,
  myBestResult
);

router.get(
  "/student/my-results",
  protect,
  getMyResults
);

router.get(
  "/leaderboard/:quizId",
  protect,
  leaderboard
);

router.get(
  "/quiz/:quizId",
  protect,
  getQuizAttempts
);

module.exports = router;