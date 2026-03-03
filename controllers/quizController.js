const Quiz = require("../models/Quiz");

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions , maxAttempts , duration} = req.body;

    // Basic Validation
    if (!title || !description || !questions) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        message: "At least one question required"
      });
    }

    // Create Quiz
    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.user.id,
      maxAttempts : maxAttempts || 1 ,
      duration : duration || null
    });

    await quiz.save();

    res.status(201).json({
      message: "Quiz uploaded successfully",
      quiz
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};


const getAllQuizzes = async (req, res) => {
  try {

    // Fetch quizzes + teacher info
    const quizzes = await Quiz.find()
      .populate("createdBy", "name email");

    // Remove correct answers
    const safeQuizzes = await Promise.all(
      quizzes.map(async (quiz) => {

        const attemptsUsed =
          await Result.countDocuments({
            student: req.user.id,
            quiz: quiz._id
          });

        const attemptsLeft =
          quiz.maxAttempts - attemptsUsed;

        return {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          createdBy: quiz.createdBy,
          createdAt: quiz.createdAt,

          maxAttempts: quiz.maxAttempts,
          attemptsUsed,
          attemptsLeft,

          questions: quiz.questions.map((q) => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options
          }))
        };
      })
    );

    res.status(200).json({
      quizzes: safeQuizzes
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
      .populate("createdBy", "name");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    // Hide correct answers
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.createdBy,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options
      }))
    };

    res.status(200).json(safeQuiz);

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const Result = require("../models/Result");

const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    // Check attempts
    const attempts = await Result.countDocuments({
      student: req.user.id,
      quiz: quizId
    });

    if (attempts >= quiz.maxAttempts) {
      return res.status(400).json({
        message: "Maximum attempts reached"
      });
    }

    //set Timer
    // Apply timer only if duration exists
    if (quiz.duration) {

      const now = new Date();
      const quizStartTime =
          new Date(req.body.startTime);

      const timeTaken =
        (now - quizStartTime) / (1000 * 60);

      if (timeTaken > quiz.duration) {
        return res.status(400).json({
          message: "Quiz time expired"
        });
      }
    }

    //Score Calculation
    let score = 0;

    quiz.questions.forEach((question) => {
      const studentAnswer = answers.find(
        ans =>
          ans.questionId.toString() ===
          question._id.toString()
      );

      if (
        studentAnswer &&
        studentAnswer.selectedAnswer === question.correctAnswer
      ) {
        score++;
      }
    });

    const result = new Result({
      student: req.user.id,
      quiz: quizId,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      attemptNumber: attempts + 1
    });

    await result.save();

    // Get all attempts of student for this quiz
    const allAttempts = await Result.find({
      student: req.user.id,
      quiz: quizId
    });

    // Find highest score
    let highestScore = Math.max(
      ...allAttempts.map(r => r.score)
    );

    // Update best attempt
    await Result.updateMany(
      { student: req.user.id, quiz: quizId },
      { bestAttempt: false }
    );

    await Result.updateOne(
      {
        student: req.user.id,
        quiz: quizId,
        score: highestScore
      },
      { bestAttempt: true }
    );

    const remainingAttempts =
      quiz.maxAttempts - (attempts + 1);

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      attemptNumber: attempts + 1,
      remainingAttempts
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      message: "Quiz started",
      startTime: new Date(),
      duration: quiz.duration
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {

    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    // Important: Only creator can delete
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this quiz"
      });
    }

    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  startQuiz,
  deleteQuiz
};
