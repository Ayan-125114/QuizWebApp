import { useEffect, useState } from "react";
import API from "../api/axios";

function MyResults() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const res = await API.get("/results/student/my-results");
    setResults(res.data.results);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">📊 My Quiz Results</h2>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
          You haven't attempted any quizzes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {results.map((r) => (
            <div key={r._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 truncate pr-4">{r.quiz?.title || 'Unknown Quiz'}</h3>
                {r.bestAttempt && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shrink-0 shadow-sm border border-amber-200">
                    ⭐ Best Attempt
                  </span>
                )}
              </div>
              
              <div className="mt-auto grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Score</p>
                  <p className="text-2xl font-bold text-indigo-600">{r.score}<span className="text-lg text-slate-400">/{r.totalQuestions}</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Attempt</p>
                  <p className="text-2xl font-bold text-slate-700">#{r.attemptNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyResults;