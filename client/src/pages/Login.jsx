import { useState } from "react";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {

        const res = await API.post("/auth/login", {
        email,
        password
        });

        const token = res.data.token;

        login(token);

        // Decode token
        const user = jwtDecode(token);

        // Role based redirect
        if (user.role === "student") {
        navigate("/student");
        }
        else if (user.role === "teacher") {
        navigate("/teacher");
        }
        else if (user.role === "admin") {
        navigate("/admin");
        }

      } catch (err) {
            alert("Login Failed");
      }
    };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;