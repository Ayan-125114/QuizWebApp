import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function TeacherQuizResults() {

  const { quizId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {

      const res = await API.get(
        `/results/teacher/quiz-results/${quizId}`
      );

      setResults(res.data.results);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">📊 Best Results</h2>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          No attempts recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{r.student.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{r.student.email}</p>
              
              <div className="mt-auto bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Best Score</span>
                <span className="text-xl font-bold text-emerald-600">{r.score}<span className="text-sm text-slate-400">/{r.totalQuestions}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherQuizResults;