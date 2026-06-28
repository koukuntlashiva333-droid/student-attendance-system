import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Register.css";

function Register() {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({

    username:"",
    email:"",
    password:""

  });

  const [message,setMessage] = useState("");

  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const registerUser=async()=>{

    const res=await fetch(

      "http://127.0.0.1:5000/register",

      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify(formData)

      }

    );

    const data=await res.json();

    setMessage(data.message);

    if(res.ok){

      setTimeout(()=>{

        navigate("/login");

      },1500);

    }

  };

  return(

    <div className="login-page">

      <div className="login-card">

        <div className="login-left">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="register"
          />

        </div>

        <div className="login-right">

          <h1>✨ Create Account</h1>

          <p>
            Join Student Attendance System
          </p>

          <div className="input-box">

            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />

          </div>

          <div className="input-box">

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

          </div>

          <div className="input-box">

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

          </div>

          <button
            className="login-btn"
            onClick={registerUser}
          >
            Register
          </button>

          <p
            style={{
              marginTop:"15px"
            }}
          >
            {message}
          </p>

          <div className="switch-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;