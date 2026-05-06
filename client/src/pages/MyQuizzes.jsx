import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyQuizzes() {

  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {

      const res =
        await API.get("/dashboard/teacher");

      setQuizzes(res.data.quizzes);

    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuiz = async (quizId) => {

    if (!window.confirm("Delete this quiz?"))
      return;

    try {

      await API.delete(`/quiz/${quizId}`);
      fetchQuizzes();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">📚 My Quizzes</h1>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          You haven't created any quizzes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{quiz.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-2 text-sm">{quiz.description}</p>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-md">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Max Attempts</span>
                    <span className="font-bold text-slate-700">{quiz.maxAttempts}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-md">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Duration</span>
                    <span className="font-bold text-slate-700">{quiz.duration ? `${quiz.duration} min` : "Infinite"}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 mt-auto">
                <button
                  className="flex-1 py-2 px-3 border border-indigo-200 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                  onClick={() => navigate(`/teacher/quiz-results/${quiz._id}`)}
                >
                  📊 Results
                </button>
                <button
                  className="flex-1 py-2 px-3 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  onClick={() => navigate(`/leaderboard/${quiz._id}`)}
                >
                  🏆 Top
                </button>
                <button
                  className="w-full mt-2 py-2 px-3 border border-red-200 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                  onClick={() => deleteQuiz(quiz._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyQuizzes;