const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionText : String,
    options : [String],
    correctAnswer : String
});

const quizSchema = new Schema({
    title : String,
    description : String,
    duration: Number, // minutes

    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    questions : [questionSchema] ,

    maxAttempts: {
    type: Number,
    default: 1
  },
  duration: {
    type: Number,   // minutes
    default: null   // NULL = Infinite
  }

} , {timestamps : true});

module.exports = mongoose.model("Quiz" , quizSchema);