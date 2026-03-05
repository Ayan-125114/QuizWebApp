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
    <div style={styles.container}>

      <h1>📚 My Quizzes</h1>

      <div style={styles.grid}>

        {quizzes.map((quiz) => (

          <div key={quiz._id}
               style={styles.card}>

            <h3>{quiz.title}</h3>

            <p>{quiz.description}</p>

            <p>
              Max Attempts:
              <b> {quiz.maxAttempts}</b>
            </p>

            <p>
              Duration:
              <b>
                {" "}
                {quiz.duration
                  ? `${quiz.duration} min`
                  : "Infinite"}
              </b>
            </p>

            <div style={styles.actions}>

              <button
                onClick={() =>
                  navigate(`/teacher/quiz-results/${quiz._id}`)
                }
              >
                📊 Results
              </button>

              <button
                onClick={() =>
                  navigate(`/leaderboard/${quiz._id}`)
                }
              >
                🏆 Leaderboard
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() =>
                  deleteQuiz(quiz._id)
                }
              >
                🗑 Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

const styles = {

  container: {
    padding: "30px",
    fontFamily: "Arial"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },

  card: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default MyQuizzes;