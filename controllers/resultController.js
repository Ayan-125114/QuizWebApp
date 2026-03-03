const Result = require("../models/Result");
const Quiz = require("../models/Quiz");

// Teacher view best scores
const getQuizBestResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    // check quiz exists
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    // Only best attempts
    const results = await Result.find({
      quiz: quizId,
      bestAttempt: true
    })
      .populate("student", "name email")
      .sort({ score: -1 });

    res.status(200).json({
      totalStudents: results.length,
      results
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const myBestResult = async (req, res) => {
  try {

    const { quizId } = req.params;

    const result = await Result.findOne({
      student: req.user.id,
      quiz: quizId,
      bestAttempt: true
    }).populate("quiz", "title");

    if (!result) {
      return res.status(404).json({
        message: "No result found"
      });
    }

    res.status(200).json(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const leaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;

    const results = await Result.find({
      quiz: quizId,
      bestAttempt: true
    })
      .populate("student", "name email")
      .sort({ score: -1 });

    res.json({
      leaderboard: results
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};


const getMyResults = async (req, res) => {
  try {

    const results = await Result.find({
      student: req.user.id
    })
    .populate("quiz", "title description")
    .sort({ createdAt: -1 });

    res.status(200).json({
      results
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};


const getQuizAttempts = async (req, res) => {
  try {

    const { quizId } = req.params;

    const results = await Result.find({
      quiz: quizId
    })
      .populate("student", "name email")
      .sort({ score: -1 });

    res.status(200).json({
      results
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};



module.exports = { getQuizBestResults , myBestResult , leaderboard , getMyResults , getQuizAttempts};