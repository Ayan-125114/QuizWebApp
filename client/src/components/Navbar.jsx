import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid black" }}>

      <Link to="/">Home</Link>

      {!user ? (
        <>
          {" | "}
          <Link to="/">Login</Link>
          {" | "}
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          {" | "}
          {user.role === "student" && (
            <Link to="/student">Student Dashboard</Link>
          )}

          {user.role === "teacher" && (
            <Link to="/teacher">Teacher Dashboard</Link>
          )}

          {user.role === "admin" && (
            <Link to="/admin">Admin Dashboard</Link>
          )}

          {" | "}
          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}

    </nav>
  );
}

export default Navbar;