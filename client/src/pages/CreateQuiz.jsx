import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [duration, setDuration] = useState("");

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    }
  ]);

  // ---------- Question Change ----------
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // ---------- Option Change ----------
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // ---------- Correct Answer ----------
  const handleCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // ---------- Add Question ----------
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      }
    ]);
  };

  // ---------- Submit ----------
  const handleSubmit = async () => {
    try {

      await API.post("/quiz/create", {
        title,
        description,
        maxAttempts,
        questions,
        duration: duration || null
      });

      alert("Quiz Created ✅");
      navigate("/teacher");

    } catch (error) {
      console.log(error);
      alert("Failed to create quiz");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>🧑‍🏫 Create New Quiz</h2>

      <input
        placeholder="Quiz Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <br /><br />

      {/* MAX ATTEMPTS */}
        <div>
            <label>
            Max Attempts
            </label>

            <input
            type="number"
            min="1"
            value={maxAttempts}
            onChange={(e)=>
                setMaxAttempts(e.target.value)
            }
            />
        </div>
            <br></br>
      {/* DURATION */}
        <div>
            <label>
            Duration (Minutes)
            </label>

            <input
            type="number"
            placeholder="Leave empty = Infinite"
            value={duration}
            onChange={(e)=>
                setDuration(e.target.value)
            }
            />
        </div>


      <hr />

      {questions.map((q, qIndex) => (

        <div key={qIndex}
             style={{border:"1px solid black",margin:"10px",padding:"10px"}}>

          <h3>Question {qIndex + 1}</h3>

          <input
            placeholder="Question"
            value={q.questionText}
            onChange={(e)=>
              handleQuestionChange(qIndex,e.target.value)
            }
          />

          <br /><br />

          {q.options.map((opt, oIndex) => (

            <div key={oIndex}>
              <input
                placeholder={`Option ${oIndex+1}`}
                value={opt}
                onChange={(e)=>
                  handleOptionChange(
                    qIndex,
                    oIndex,
                    e.target.value
                  )
                }
              />
            </div>

          ))}

          <br />

          <input
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={(e)=>
              handleCorrectAnswer(
                qIndex,
                e.target.value
              )
            }
          />

        </div>

      ))}

      <button onClick={addQuestion}>
        ➕ Add Question
      </button>

      <br /><br />

      <button onClick={handleSubmit}>
        ✅ Create Quiz
      </button>

    </div>
  );
}

export default CreateQuiz;