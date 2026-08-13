import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/ui/button";
import Header from "../components/Header";
import "./Login.css"; // separate CSS file

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "", // email / username / phoneNumber
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim())
      newErrors.username = "Username / Email / Phone Number is required";

    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT LOGIN ----------------
  const submitLogin = async () => {
    if (!validateForm()) return;

    const payload = {
      email: formData.username,
      password: formData.password
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5050/api/v1/user/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ STORE LOGIN DATA
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userType", response.data.user.userType);

      alert("Login Successful!");

      // 🔹 Redirect to landing page, LandingRedirect will handle role-based navigation
      navigate("/");

    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Login Failed");
    }
  };

  return (
    <div className="login-page">
      <Header />

      {/* 🔹 MAIN CONTENT */}
      <div className="login-container">

        {/* LEFT IMAGE */}
        <div className="login-image hero-single">
          <div className="hero-full-image">
            <img src="/index3.png" alt="Login visual" />

            <div className="hero-overlay">
              <span className="badge">⚡ Groceries in 10 minutes</span>

              <h1 className="title">
                Fresh groceries, <span className="highlight">delivered fast</span>
              </h1>

              <p className="subtitle">
                From farm-fresh vegetables to daily essentials, get everything
                delivered to your doorstep in minutes.
              </p>
            </div>
          </div>
        </div>


        {/* RIGHT CARD */}
        <div className="signup-card">
          <div className="signup-logo" onClick={() => navigate("/")}>
            <img src="/logo1.png" alt="FreshCart Logo" />
            <span>FreshCart</span>
          </div>

          <label>Username / Email / Phone Number</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username, email or phone number"
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <Button className="primary-btn" onClick={submitLogin}>
            ⚡ Login
          </Button>

          <p className="footer-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
          <p className="terms-text">
            By signing in, you agree to our <span>Terms</span> and{" "}
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );

};

export default Login;
