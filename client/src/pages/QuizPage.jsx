import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function QuizPage() {

  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const answersRef = useRef([]);
  const startTimeRef = useRef(null);
  const isSubmitting = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // ===============================
  // FETCH QUIZ ON MOUNT
  // ===============================
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizRes = await API.get(`/quiz/${quizId}`);
        setQuiz(quizRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // ===============================
  // START QUIZ & FULLSCREEN
  // ===============================
  const handleStartQuizClick = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      const startRes = await API.post(`/quiz/start/${quizId}`);
      
      setStartTime(startRes.data.startTime);
      startTimeRef.current = startRes.data.startTime;
      setDuration(startRes.data.duration);

      if (startRes.data.duration) {
        setTimeLeft(startRes.data.duration * 60);
      }

      setIsQuizActive(true);
    } catch (error) {
      console.log(error);
      alert("Failed to start quiz. Fullscreen permission is required to prevent cheating.");
    }
  };

  // ===============================
  // ANTI-CHEAT LISTENERS
  // ===============================
  useEffect(() => {
    if (!isQuizActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitting.current) {
        alert("Warning: You switched tabs! Quiz has been automatically submitted.");
        handleSubmit(true);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmitting.current) {
        alert("Warning: You exited fullscreen! Quiz has been automatically submitted.");
        handleSubmit(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizActive]);

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
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const res = await API.post(
        `/quiz/submit/${quizId}`,
        {
          answers: answersRef.current,
          startTime: startTimeRef.current
        }
      );

      alert(
        `Score: ${res.data.score}/${res.data.totalQuestions}\nAttempt: ${res.data.attemptNumber}\nRemaining Attempts: ${res.data.remainingAttempts}`
      );

      // Clean up fullscreen if submitting manually
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }

      navigate("/student");

    } catch (error) {
      console.log(error);

      if (!auto) {
        alert(error.response?.data?.message || "Submission Failed");
      }
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      navigate("/student");
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

  if (!quiz) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-xl font-medium text-slate-500">Loading quiz...</div>;

  if (!isQuizActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">{quiz.title}</h2>
          <p className="text-slate-600">{quiz.description}</p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800 text-left">
            <h3 className="font-bold mb-2 flex items-center gap-2">⚠️ Anti-Cheat Security Enabled</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>This quiz requires full-screen mode.</li>
              <li>Exiting full-screen will automatically submit your quiz.</li>
              <li>Switching tabs or opening other applications will automatically submit your quiz.</li>
            </ul>
          </div>

          <button 
            onClick={handleStartQuizClick}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-lg"
          >
            Enter Fullscreen & Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{quiz.title}</h2>
          {quiz.description && <p className="text-slate-600 mt-1">{quiz.description}</p>}
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 flex items-center shadow-inner text-indigo-900 font-semibold min-w-[150px] justify-center">
          ⏱ Time Left: {duration ? formatTime() : "Unlimited"}
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, index) => (
          <div key={q._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex">
              <span className="text-indigo-600 mr-2">Q{index + 1}.</span> {q.questionText}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <label key={i} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-colors has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500">
                  <input
                    type="radio"
                    name={q._id}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    onChange={() => handleAnswer(q._id, opt)}
                  />
                  <span className="ml-3 text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={() => handleSubmit(false)}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizPage;