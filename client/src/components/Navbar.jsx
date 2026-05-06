import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isQuizPage = location.pathname.match(/^\/quiz\/[a-zA-Z0-9_-]+$/);
  if (isQuizPage) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-xl font-bold tracking-tight hover:text-indigo-200 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              EduSpark Quiz
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm">Register</Link>
              </>
            ) : (
              <>
                {user.role === "student" && (
                  <Link to="/student" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Student Dashboard</Link>
                )}
                {user.role === "teacher" && (
                  <Link to="/teacher" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Teacher Dashboard</Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin Dashboard</Link>
                )}
                <div className="flex items-center ml-4 border-l border-indigo-400 pl-4">
                  <span className="text-sm text-indigo-100 mr-4 hidden sm:block">Hello, {user.name || user.role}</span>
                  <button onClick={handleLogout} className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-indigo-400 shadow-sm">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;