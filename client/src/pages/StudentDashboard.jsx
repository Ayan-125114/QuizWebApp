import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
  try {

    const res = await API.get("/quiz");
    const quizList = res.data.quizzes;

    setQuizzes(quizList);

    // fetch result for each quiz
    quizList.forEach(async (quiz) => {
      try {
        const resultRes =
          await API.get(
            `/results/student/my-result/${quiz._id}`
          );
          console.log(quiz.title);
          console.log(resultRes.data);

        setResults(prev => ({
          ...prev,
          [quiz._id]: resultRes.data
        }));

      } catch {
        // no result yet
      }
    });

  } catch (error) {
    console.log(error);
  }
};
  const startQuiz = async (quizId) => {
    const res = await API.post(`/quiz/start/${quizId}`);

    navigate(`/quiz/${quizId}`, {
      state: res.data
    });
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🎓 Student Dashboard</h1>

        <button
          style={styles.resultBtn}
          onClick={() => navigate("/my-results")}
        >
          📊 My Results
        </button>
      </div>

      <h2 style={{marginTop:"20px"}}>Available Quizzes</h2>

      <div style={styles.grid}>

        {quizzes.map((quiz) => (

          <div key={quiz._id} style={styles.card}>

            <h3>{quiz.title}</h3>

            <p style={{color:"#555"}}>
              {quiz.description}
            </p>

            <p>
              Attempts Left:
              <b>
                {" "}
                {quiz.attemptsLeft} / {quiz.maxAttempts}
              </b>
            </p>

            {results[quiz._id] && (
              <div style={{ marginTop: "10px" }}>
                <p>
                  ✅ Best Score:
                  <b>
                    {" "}
                    {results[quiz._id].score} /
                    {results[quiz._id].totalQuestions}
                  </b>
                </p>
              </div>
            )}

            <button
              style={{
                ...styles.startBtn,
                background:
                  quiz.attemptsLeft <= 0
                    ? "#ccc"
                    : "#4CAF50"
              }}
              disabled={quiz.attemptsLeft <= 0}
              onClick={() => startQuiz(quiz._id)}
            >
              {quiz.attemptsLeft <= 0
                ? "No Attempts Left"
                : "Start Quiz"}
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default StudentDashboard;


/* ================= STYLES ================= */

const styles = {

  container: {
    padding: "30px",
    fontFamily: "Arial"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  resultBtn: {
    padding: "10px 18px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
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
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
    background: "white"
  },

  startBtn: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    width: "100%"
  }
};