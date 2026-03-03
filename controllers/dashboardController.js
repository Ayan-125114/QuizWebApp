const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

const studentDashboard = async (req, res) => {
  try {

    const results = await Result.find({
      student: req.user.id,
      bestAttempt: true
    }).populate("quiz", "title maxAttempts");

    const dashboard = results.map(r => ({
      quizTitle: r.quiz.title,
      score: r.score,
      totalQuestions: r.totalQuestions,
      attemptsLeft:
        r.quiz.maxAttempts - r.attemptNumber
    }));

    res.json({
      totalQuizzesAttempted: dashboard.length,
      dashboard
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const teacherDashboard = async (req, res) => {
  try {

    const quizzes = await Quiz.find({
      createdBy: req.user.id
    });

    const totalQuizzes = quizzes.length;

    const quizIds = quizzes.map(q => q._id);

    const results = await Result.find({
      quiz: { $in: quizIds }
    });

    const totalAttempts = results.length;

    const highestScore =
      results.length > 0
        ? Math.max(...results.map(r => r.score))
        : 0;

    const averageScore =
      results.length > 0
        ? (
            results.reduce(
              (sum, r) => sum + r.score,
              0
            ) / results.length
          ).toFixed(2)
        : 0;

    res.json({
      totalQuizzes,
      totalAttempts,
      highestScore,
      averageScore,
      quizzes
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};


const adminDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalTeachers = await User.countDocuments({
      role: "teacher"
    });

    const totalStudents = await User.countDocuments({
      role: "student"
    });

    const pendingTeachers = await User.find({
      role: "teacher",
      isApproved: false
    }).select("name email");

    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();

    res.json({
      totalUsers,
      totalTeachers,
      totalStudents,
      totalQuizzes,
      totalAttempts,
      pendingTeachers
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = { studentDashboard , teacherDashboard , adminDashboard};