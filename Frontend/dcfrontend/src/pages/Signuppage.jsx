import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../Css/LoginSignup.css";
import logo from "../Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import google from "../Images/Google.png";
import facebook from "../Images/Facebook.png";

function Signuppage() {
  const location = useLocation();
  const [signup, setSignup] = useState({ username: '', email: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = signup;
    try {
      const response = await fetch("http://localhost:2000/api/auth/usersignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          email: email.trim(), 
          password: password.trim()
        }),
      });
      const json = await response.json();
      if (json.success) {
        alert("Signup success");
        navigate("/login");
      } else {
        alert("Signup failed: " + json.error);
      }
    } catch (error) {
      alert("Error during signup");
    }
  };

  return (
    <div className="signuppage">
      <div className="Signupform flex flex-col">
        <div className="logo">
          <img src={logo} alt="logo" className="logo-img" />
          <h1 className="mt-2 text-3xl font-bold">M.A.R.K</h1>
        </div>
        <div className="gotologinorsignup flex justify-center mt-2 ml-3">
          <Link to="/login" className={`auth-link ${location.pathname === "/login" ? "active" : ""}`}>
            Sign In
          </Link>
          <span className="separator">|</span>
          <Link to="/signup" className={`auth-link ${location.pathname === "/signup" ? "active" : ""}`}>
            Sign Up
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="username">
            <label htmlFor="username" className="labels">
              <FontAwesomeIcon className="mr-2" icon={faUser} />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={signup.username}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none mt-2"
              placeholder="Enter your username"
            />
          </div>
          <div className="email mt-4">
            <label htmlFor="email" className="labels">
              <FontAwesomeIcon className="mr-2" icon={faEnvelope} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={signup.email}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none mt-2"
              placeholder="Enter your email"
            />
          </div>
          <div className="password mb-4 mt-4 relative">
            <label htmlFor="password" className="labels">
              <FontAwesomeIcon className="mr-2" icon={faLock} />
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={signup.password}
              onChange={onChange}
              className="w-full px-4 mt-2 py-2 border rounded-lg focus:outline-none"
              placeholder="Enter your password"
            />
            <span
              className="absolute inset-y-8 right-0 flex items-center px-3 cursor-pointer mt-5"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="submit-btn flex justify-center">
            <button type="submit" className="signupbtn mt-3">Sign Up</button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <div className="or-container">
            <span className="or-line"></span>
            <span className="or-text">OR</span>
            <span className="or-line"></span>
          </div>
        </div>
        <div className="flex justify-center w-full mt-7">
          <button className="social-btn mr-2">
            <img src={google} alt="google" className="google" />
          </button>
          <button className="social-btn ml-2">
            <img src={facebook} alt="facebook" className="facebook" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;
