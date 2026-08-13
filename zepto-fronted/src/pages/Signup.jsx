import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/ui/button";
import Header from "../components/Header";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const indianStates = [
    "Andhra Pradesh",
    "Karnataka",
    "Tamil Nadu",
    "Maharashtra",
    "Delhi",
    "Telangana",
    "Kerala",
  ];


  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    isPrimary: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // -------------------- HANDLE CHANGE --------------------
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };


  // -------------------- VALIDATION STEP 1 --------------------
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.userName.trim())
      newErrors.userName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- VALIDATION STEP 2 --------------------
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required";

    if (!formData.city.trim()) newErrors.city = "City is required";

    if (!formData.country.trim()) newErrors.country = "Country is required";

    if (!formData.pinCode.trim()) newErrors.pinCode = "Pin code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- SUBMIT FORM --------------------
  const submitForm = async () => {
    if (!validateStep2()) return;

    try {
      const response = await api.post(
        "/consumer/create-account",
        formData
      );

      alert(response.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-page">
        <Header />

        {/* ================= PAGE CONTENT ================= */}
        <div className="signup-wrapper">
          <div className="signup-card">
            <h2 className="signup-title">Create your account</h2>

            <p className="subtitle">Join thousands of happy customers</p>

            {/* STEP INDICATOR */}
            <div className="steps-wrapper">
              <div className="steps-container">
                <div className="step-wrapper">
                  <div
                    className={`step ${step > 1 ? "done" : step === 1 ? "active" : ""
                      }`}
                  >
                    {step > 1 ? "✓" : "1"}
                  </div>
                  <span
                    className={`step-label ${step === 1 ? "active-label" : ""}`}
                  >
                    Personal Info
                  </span>
                </div>

                <div className="line-wrapper">
                  <div className="line-background" />
                  <div
                    className="line-fill"
                    style={{ width: step > 1 ? "100%" : "0%" }}
                  />
                </div>

                <div className="step-wrapper">
                  <div className={`step ${step === 2 ? "active" : ""}`}>2</div>
                  <span
                    className={`step-label ${step === 2 ? "active-label" : ""}`}
                  >
                    Delivery Address
                  </span>
                </div>
              </div>
            </div>

            {/* ---------------- STEP 1 ---------------- */}
            {step === 1 && (
              <>
                <label>Full Name</label>
                <input
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.userName && <p className="error">{errors.userName}</p>}

                <label>Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <label>Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
                {errors.phoneNumber && (
                  <p className="error">{errors.phoneNumber}</p>
                )}

                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                {errors.password && <p className="error">{errors.password}</p>}

                <Button
                  className="primary-btn"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                >
                  Continue →
                </Button>
              </>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
              <>
                <label>Address Line 1</label>
                <input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="House / Flat No."
                />
                {errors.addressLine1 && (
                  <p className="error">{errors.addressLine1}</p>
                )}

                <label>Address Line 2</label>
                <input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Street, Area"
                />

                <label>Address Line 3</label>
                <input
                  name="addressLine3"
                  value={formData.addressLine3}
                  onChange={handleChange}
                  placeholder="Landmark (Optional)"
                />

                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
                {errors.city && <p className="error">{errors.city}</p>}

                <label>State (Optional)</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>


                <label>Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                />
                {errors.country && <p className="error">{errors.country}</p>}

                <label>Pin Code</label>
                <input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                />
                {errors.pinCode && <p className="error">{errors.pinCode}</p>}
                <div className="consumer-primary-toggle">
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      checked={formData.isPrimary}
                      onChange={handleChange}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-text">Set as Primary Address</span>
                  </label>

                  <p className="toggle-hint">
                    Primary will be used as the default for order fulfillment
                  </p>

                  {/*  DEBUG LINE (temporary) */}

                </div>


                <div className="actions">
                  <button className="back-btn" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <Button className="primary-btn" onClick={submitForm}>
                    ⚡ Create Account
                  </Button>
                </div>
              </>
            )}

            <p className="footer-text">
              Already have an account?{" "}
              <span onClick={() => navigate("/user/login")}>LogIn</span>
            </p>

            <p className="terms-text">
              By signing up, you agree to our{" "}
              <span>Terms of Service</span> and <span>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
