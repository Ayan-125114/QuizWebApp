const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz"
  },

  answers: [
    {
      questionId: Schema.Types.ObjectId,
      selectedAnswer: String
    }
  ],

  score: Number,
  totalQuestions: Number ,

  attemptNumber: Number,

  bestAttempt: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);