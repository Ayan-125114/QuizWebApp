import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {

  const token = localStorage.getItem("token");

  // No login
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const user = jwtDecode(token);

    // Role check
    if (allowedRole && user.role !== allowedRole) {
      return <Navigate to="/" />;
    }

    return children;

  } catch (error) {
    return <Navigate to="/" />;
  }
}

export default ProtectedRoute;