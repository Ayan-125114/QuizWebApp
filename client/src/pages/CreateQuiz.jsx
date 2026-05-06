import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [duration, setDuration] = useState("");

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    }
  ]);

  // ---------- Question Change ----------
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // ---------- Option Change ----------
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // ---------- Correct Answer ----------
  const handleCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // ---------- Add Question ----------
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      }
    ]);
  };

  // ---------- Submit ----------
  const handleSubmit = async () => {
    try {

      await API.post("/quiz/create", {
        title,
        description,
        maxAttempts,
        questions,
        duration: duration || null
      });

      alert("Quiz Created ✅");
      navigate("/teacher");

    } catch (error) {
      console.log(error);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8 flex items-center gap-2">
        <span>🧑‍🏫</span> Create New Quiz
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Title</label>
          <input
            placeholder="E.g., Midterm Exam"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            placeholder="What is this quiz about?"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Attempts</label>
            <input
              type="number"
              min="1"
              value={maxAttempts}
              onChange={(e)=>setMaxAttempts(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Minutes)</label>
            <input
              type="number"
              placeholder="Leave empty for Infinite"
              value={duration}
              onChange={(e)=>setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Question {qIndex + 1}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                <input
                  placeholder="Enter your question here"
                  value={q.questionText}
                  onChange={(e)=>handleQuestionChange(qIndex,e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Option {oIndex + 1}</label>
                    <input
                      placeholder={`Option ${oIndex+1}`}
                      value={opt}
                      onChange={(e)=>handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">Correct Answer</label>
                <input
                  placeholder="Must match one of the options exactly"
                  value={q.correctAnswer}
                  onChange={(e)=>handleCorrectAnswer(qIndex, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
        <button 
          onClick={addQuestion}
          className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          ➕ Add Another Question
        </button>

        <button 
          onClick={handleSubmit}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          ✅ Create Quiz
        </button>
      </div>
    </div>
  );
}

export default CreateQuiz;