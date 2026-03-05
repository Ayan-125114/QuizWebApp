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
    <div>

      <h2>Student Attempts</h2>

      {attempts.map((a) => (

        <div key={a._id}
             style={{
               border:"1px solid black",
               margin:"10px",
               padding:"10px"
             }}>

          <h3>{a.student.name}</h3>
          <p>Email: {a.student.email}</p>
          <p>
            Score:
            {a.score}/{a.totalQuestions}
          </p>
          <p>Attempt: {a.attemptNumber}</p>

        </div>
      ))}

    </div>
  );
}

export default QuizAttempts;