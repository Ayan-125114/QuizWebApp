import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function QuizPage() {

  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // ===============================
  // START QUIZ
  // ===============================
  useEffect(() => {
    startQuiz();
  }, []);

  const startQuiz = async () => {
    try {

      // get quiz data
      const quizRes = await API.get(`/quiz/${quizId}`);
      setQuiz(quizRes.data);

      // start quiz timer from backend
      const startRes =
        await API.post(`/quiz/start/${quizId}`);

      setStartTime(startRes.data.startTime);
      setDuration(startRes.data.duration);

      // if duration exists → start countdown
      if (startRes.data.duration) {
        setTimeLeft(startRes.data.duration * 60);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ===============================
  // TIMER LOGIC
  // ===============================
  useEffect(() => {

    if (!timeLeft) return;

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // auto submit
          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  // ===============================
  // STORE ANSWERS
  // ===============================
  const handleAnswer = (questionId, option) => {

    setAnswers(prev => {

      const filtered =
        prev.filter(a => a.questionId !== questionId);

      return [
        ...filtered,
        { questionId, selectedAnswer: option }
      ];
    });
  };

  // ===============================
  // SUBMIT QUIZ
  // ===============================
  const handleSubmit = async (auto = false) => {
    try {

      const res = await API.post(
        `/quiz/submit/${quizId}`,
        {
          answers,
          startTime
        }
      );

      alert(
        `Score: ${res.data.score}/${res.data.totalQuestions}
Attempt: ${res.data.attemptNumber}
Remaining Attempts: ${res.data.remainingAttempts}`
      );

    } catch (error) {

      console.log(error);

      if (!auto)
        alert(error.response?.data?.message || "Submission Failed");
    }
  };

  // ===============================
  // TIMER FORMAT
  // ===============================
  const formatTime = () => {
    if (!timeLeft) return "Unlimited";

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!quiz) return <h2>Loading...</h2>;

  return (
    <div>

      <h2>{quiz.title}</h2>

      <h3>
        Time Left: {duration ? formatTime() : "Unlimited"}
      </h3>

      {quiz.questions.map((q, index) => (

        <div
          key={q._id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px"
          }}
        >

          <h3>
            Q{index + 1}. {q.questionText}
          </h3>

          {q.options.map((opt, i) => (

            <div key={i}>
              <input
                type="radio"
                name={q._id}
                onChange={() =>
                  handleAnswer(q._id, opt)
                }
              />
              {opt}
            </div>

          ))}

        </div>

      ))}

      <button onClick={() => handleSubmit()}>
        Submit Quiz
      </button>

    </div>
  );
}

export default QuizPage;