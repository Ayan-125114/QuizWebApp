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
    <div>
      <h2>📊 Quiz Attempts</h2>

      {results.map((r, index) => (

        <div
          key={index}
          style={{
            border:"1px solid black",
            margin:"10px",
            padding:"10px"
          }}
        >
          <h3>{r.student.name}</h3>
          <p>Email: {r.student.email}</p>
          <p>
            Score:
            {r.score}/{r.totalQuestions}
          </p>
        </div>

      ))}

    </div>
  );
}

export default TeacherQuizResults;