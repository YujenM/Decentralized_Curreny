import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import "../Css/LoginSignup.css";
import logo from "../Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import google from "../Images/Google.png";
import facebook from "../Images/Facebook.png";

function Login() {
  const location = useLocation();
  const [login, setLogin] = useState({ username: "", email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = login.username.trim();
    const trimmedPassword = login.password.trim();
    if (trimmedUsername === "" || trimmedPassword === "") {
      alert("Username and password are required");
      return;
    }
    try {
      const response = await fetch("http://localhost:2000/api/auth/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          identifier: trimmedUsername,
          password: trimmedPassword,
        }),
      });
      const json = await response.json();
      if (json.success) {
        localStorage.setItem("authtoken", json.token); 
        console.log("Login success");
        alert("Login success");
        setLogin({ username: "", email: "", password: "" });
        navigate("/");
      } else {
        console.log("Login failed:", json.message);
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login");
    }
  };

  const onChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="loginpage">
      <div className="loginform flex flex-col">
        <div className="logo ">
          <img src={logo} alt="logo" className="logo-img " />
          <h1 className="mt-2 text-3xl font-bold">M.A.R.K</h1>
        </div>
        <div className="gotologinorsignup flex justify-center mt-2 ml-3">
          <Link
            to="/login"
            className={`auth-link ${
              location.pathname === "/login" ? "active" : ""
            }`}
          >
            Sign In
          </Link>
          <span className="separator">|</span>
          <Link
            to="/signup"
            className={`auth-link ${
              location.pathname === "/signup" ? "active" : ""
            }`}
          >
            Sign Up
          </Link>
        </div>
        <div className=" mb-4">
          <form onSubmit={handlesubmit}>
            <div className="username">
              <label htmlFor="username" className="labels">
                <FontAwesomeIcon className="mr-2" icon={icon.faUser} />
                Username / Email
              </label>{" "}
              <br />
              <input
                type="text"
                name="username"
                value={login.username}
                onChange={onChange}
                className="w-full  px-4 py-2 border rounded-lg focus:outline-none mt-2"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4 mt-4 relative">
              <label htmlFor="password" className="labels">
                <FontAwesomeIcon className="mr-2" icon={icon.faLock} />
                Password
              </label>{" "}
              <br />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={login.password}
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
            <div className="flex justify-end ">
              <Link to="/forgot-password" className="text-sm forgotpass text-blue-500">
                Forgot Password?
              </Link>
            </div>
            <div className="submit-btn flex justify-center ">
              <button className="loginbtn mt-3">Sign In</button>
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
    </div>
  );
}

export default Login;
