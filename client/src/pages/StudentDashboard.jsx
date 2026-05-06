import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
  try {

    const res = await API.get("/quiz");
    const quizList = res.data.quizzes;

    setQuizzes(quizList);

    // fetch result for each quiz
    quizList.forEach(async (quiz) => {
      try {
        const resultRes =
          await API.get(
            `/results/student/my-result/${quiz._id}`
          );
          console.log(quiz.title);
          console.log(resultRes.data);

        setResults(prev => ({
          ...prev,
          [quiz._id]: resultRes.data
        }));

      } catch {
        // no result yet
      }
    });

  } catch (error) {
    console.log(error);
  }
};
  const startQuiz = async (quizId) => {
    const res = await API.post(`/quiz/start/${quizId}`);

    navigate(`/quiz/${quizId}`, {
      state: res.data
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">🎓 Student Dashboard</h1>
        <button
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          onClick={() => navigate("/my-results")}
        >
          📊 My Results
        </button>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Quizzes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{quiz.title}</h3>
              <p className="text-slate-600 mb-4 line-clamp-3">{quiz.description}</p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-500">Attempts Left:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {quiz.attemptsLeft} / {quiz.maxAttempts}
                </span>
              </div>

              {results[quiz._id] && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-sm text-emerald-800 font-medium flex items-center justify-between">
                    <span>✅ Best Score:</span>
                    <span className="font-bold text-emerald-900">
                      {results[quiz._id].score} / {results[quiz._id].totalQuestions}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
              <button
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white shadow-sm transition-colors ${
                  quiz.attemptsLeft <= 0
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
                disabled={quiz.attemptsLeft <= 0}
                onClick={() => startQuiz(quiz._id)}
              >
                {quiz.attemptsLeft <= 0 ? "No Attempts Left" : "Start Quiz"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;