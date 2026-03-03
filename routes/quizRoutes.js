const express = require("express");
const router = express.Router();

const {protect , teacherOnly} = require("../middleware/authMiddleware");
const {createQuiz , getAllQuizzes , getQuizById , submitQuiz , startQuiz , deleteQuiz} = require("../controllers/quizController");

router.post("/create" , protect , teacherOnly , createQuiz);

router.get("/", protect, getAllQuizzes);

router.get("/:quizId", protect, getQuizById);

router.post("/submit/:quizId", protect, submitQuiz);

router.post("/start/:quizId" , protect , startQuiz);


router.delete("/:quizId", protect, teacherOnly, deleteQuiz);

module.exports = router;