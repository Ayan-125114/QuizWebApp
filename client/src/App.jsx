import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import QuizPage from "./pages/QuizPage";
import MyResults from "./pages/MyResults";
import QuizAttempts from "./pages/QuizAttempts";
import Leaderboard from "./pages/Leaderboard";
import TeacherQuizResults from "./pages/TeacherQuizResults";
import CreateQuiz from "./pages/CreateQuiz";
import MyQuizzes from "./pages/MyQuizzes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute allowedRole="student">
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-results"
          element={
            <ProtectedRoute allowedRole="student">
              <MyResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-attempts/:quizId"
          element={<QuizAttempts />}
        />
        <Route
          path="/leaderboard/:quizId"
          element={<Leaderboard />}
        />
        <Route
          path="/teacher/quiz-results/:quizId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherQuizResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quiz"
          element={<CreateQuiz />}
        />
        <Route
          path="/my-quizzes"
          element={<MyQuizzes />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;