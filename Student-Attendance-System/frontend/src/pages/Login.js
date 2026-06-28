import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");

      } else {

        setError(data.message);

      }

    } catch {

      setError("Server connection failed");

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-left">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="Student"
          />

          <h2>
            Student Attendance System
          </h2>

          <p>
            Smart Attendance Management
            for Modern Classrooms
          </p>

        </div>


        <div className="login-right">

          <h1>Welcome Back 👋</h1>

          <p className="login-subtitle">
            Login to continue
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
          />

          <button onClick={handleLogin}>
            Login
          </button>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Login;