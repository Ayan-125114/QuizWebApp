import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {

  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const res =
        await API.get("/dashboard/teacher");
      setData(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">👨‍🏫 Teacher Dashboard</h1>
        <div className="flex space-x-3">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            onClick={() => navigate("/my-quizzes")}
          >
            📚 My Quizzes
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            onClick={() => navigate("/create-quiz")}
          >
            + Create Quiz
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Quizzes Overview</h2>

      {data.quizzes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-slate-500 mb-4">You haven't created any quizzes yet.</p>
          <button onClick={() => navigate("/create-quiz")} className="text-indigo-600 font-medium hover:text-indigo-800">Create your first quiz &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{quiz.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-2 text-sm">{quiz.description}</p>
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 grid grid-cols-1 gap-2">
                <button
                  className="w-full text-center py-2 px-4 border border-indigo-200 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  onClick={() => navigate(`/quiz-attempts/${quiz._id}`)}
                >
                  View Attempts
                </button>
                <div className="flex gap-2 mt-1">
                  <button
                    className="flex-1 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/leaderboard/${quiz._id}`)}
                  >
                    🏆 Leaderboard
                  </button>
                  <button
                    className="flex-1 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/teacher/quiz-results/${quiz._id}`)}
                  >
                    📈 Best Results
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;