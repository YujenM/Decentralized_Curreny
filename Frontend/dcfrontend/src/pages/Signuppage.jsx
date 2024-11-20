import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../Css/LoginSignup.css";
import logo from "../Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import Spinner from "../Components/Spinner";

function Signuppage(props) {
  const location = useLocation();
  const [signup, setSignup] = useState({ username: "", email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Spinner state
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authtoken");
    if (authToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = signup;

    const requestBody = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    if (username === "" || email === "" || password === "") {
      props.Displayalert("Please fill all the fields", "Danger", "faExclamation");
      return;
    }

    setIsLoading(true); // Start spinner
    try {
      const host =
        "https://decentralized-curreny.onrender.com"
          ? "https://decentralized-curreny.onrender.com"
          : "http://localhost:2000";
      const response = await fetch(`${host}/api/auth/usersignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        props.Displayalert("Signup successful", "Check", "faCheck");
        setSignup({ username: "", email: "", password: "" });
        navigate("/login");
      } else {
        if (json.error && Array.isArray(json.error)) {
          json.error.forEach((err) => {
            props.Displayalert(`${err.msg}`, "Info", "faExclamation");
          });
        } else {
          props.Displayalert(`${json.message}`, "Danger", "faExclamation");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      props.Displayalert("Error during signup. Please try again.", "Danger", "faExclamation");
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div className="signuppage">
      {isLoading && <Spinner />} {/* Display Spinner while loading */}
      <div className={`Signupform flex flex-col ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="logo">
          <img src={logo} alt="logo" className="logo-img" />
          <h1 className="mt-2 text-3xl font-bold">M.A.R.K</h1>
        </div>
        <div className="gotologinorsignup flex justify-center mt-2 ml-3">
          <Link
            to="/login"
            className={`auth-link ${location.pathname === "/login" ? "active" : ""}`}
          >
            Sign In
          </Link>
          <span className="separator">|</span>
          <Link
            to="/signup"
            className={`auth-link ${location.pathname === "/signup" ? "active" : ""}`}
          >
            Sign Up
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="username">
            <label htmlFor="username" className="labels">
              <FontAwesomeIcon className="mr-2" icon={icon.faUser} />
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
              <FontAwesomeIcon className="mr-2" icon={icon.faEnvelope} />
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
              <FontAwesomeIcon className="mr-2" icon={icon.faLock} />
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
              <FontAwesomeIcon
                className="eyeicon"
                icon={passwordVisible ? icon.faEyeSlash : icon.faEye}
              />
            </span>
          </div>
          <div className="submit-btn flex justify-center">
            <button type="submit" className="signupbtn mt-3" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signuppage;
