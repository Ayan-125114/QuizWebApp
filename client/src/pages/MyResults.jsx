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
    <div>
      <h2>My Quiz Results</h2>

      {results.map((r) => (
        <div key={r._id}
          style={{border:"1px solid black",margin:"10px"}}>

          <h3>{r.quiz.title}</h3>

          <p>Score: {r.score}/{r.totalQuestions}</p>
          <p>Attempt: {r.attemptNumber}</p>

          {r.bestAttempt && (
            <p style={{color:"green"}}>
              ⭐ Best Attempt
            </p>
          )}

        </div>
      ))}

    </div>
  );
}

export default MyResults;