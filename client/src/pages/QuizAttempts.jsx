import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function QuizAttempts() {

  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    const res =
      await API.get(`/results/quiz/${quizId}`);

    setAttempts(res.data.results);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">👨‍🎓 Student Attempts</h2>

      {attempts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          No attempts recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attempts.map((a) => (
            <div key={a._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{a.student.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{a.student.email}</p>
              
              <div className="mt-auto grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Score</p>
                  <p className="text-xl font-bold text-indigo-600">{a.score}<span className="text-sm text-slate-400">/{a.totalQuestions}</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Attempt</p>
                  <p className="text-xl font-bold text-slate-700">#{a.attemptNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizAttempts;