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
    <div>

      <h1>👨‍🏫 Teacher Dashboard</h1>

      <button
        onClick={() => navigate("/create-quiz")}
      >
        Create Quiz
      </button>

      <h2>Your Quizzes</h2>

      {data.quizzes.map((quiz) => (

        <div key={quiz._id}>
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
          <button
            onClick={() =>
              navigate(`/quiz-attempts/${quiz._id}`)
            }
          >
            View Attempts
          </button>
          <button
            onClick={() =>
              navigate(`/leaderboard/${quiz._id}`)
            }
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={() =>
              navigate(`/teacher/quiz-results/${quiz._id}`)
            }
          >
            🏆 Best Results
          </button>
        </div>

      ))}

      <button
  onClick={() => navigate("/my-quizzes")}
>
  📚 My Quizzes
</button>

    </div>
  );
}

export default TeacherDashboard;