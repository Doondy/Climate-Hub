import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [role, setRole] = useState("traveler");
  const [employeeSubRoute, setEmployeeSubRoute] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // New toggle for sign-up form

  // Sign Up form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const employeeRoutes = ["profile", "reports", "settings", "tasks"];

  // --- LOGIN FUNCTION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("Please enter email and password!");
      return;
    }

    // For traveler role, use simple localStorage (no API)
    if (role === "traveler") {
      localStorage.setItem("user", email);
      localStorage.setItem("role", "traveler");
      navigate("/traveller");
      return;
    }

    // For employee role, authenticate via API
    if (role === "employee") {
      if (!employeeSubRoute) {
        setError("Please select an Employee action (Profile, Reports, etc.)");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("role", "employee");
          
          // Navigate to selected employee route
          navigate(`/employee/${employeeSubRoute}`);
        } else {
          setError(data.message || "Invalid credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Cannot connect to server. Please check if the backend is running.");
      }
    } else {
      setError("Invalid role selected!");
    }
  };

  // --- SIGNUP FUNCTION ---
  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !username || !newPassword || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    console.log("New User Registered:", { name, username });
    alert("Registration successful! You can now log in.");
    setIsSignUp(false); // Go back to login form
  };

  // --- EMPLOYEE SUB NAV ---
  const EmployeeSubNav = () => (
    <div className="employee-sub-nav">
      {employeeRoutes.map((route) => (
        <button
          key={route}
          className={employeeSubRoute === route ? "active-sub-route" : ""}
          onClick={() => {
            setEmployeeSubRoute(route);
            setError("");
          }}
        >
          {route.charAt(0).toUpperCase() + route.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="login-container">
      {/* LEFT PANEL - FORM SECTION */}
      <div className="login-left-panel">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-icon">🌤️</div>
          <span className="logo-text">ClimateHub</span>
        </div>

        {/* Main Content */}
        <div className="form-content">
          <h1 className="main-heading">
            {isSignUp ? "Create your account" : "Welcome back"}
            {isSignUp && <span className="sub-text"> good move!</span>}
          </h1>

          {!isSignUp ? (
            <>
              <p className="signup-prompt">
                Don't have an account?{" "}
                <span
                  className="sign-in-link"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                  }}
                >
                  Sign up here
                </span>
                <span className="chevron"> →</span>
              </p>

              {/* Role Selection */}
              <div className="role-selection">
                <p className="role-label">Login as:</p>
                <div className="role-tabs">
                  <button
                    className={role === "traveler" ? "active" : ""}
                    onClick={() => {
                      setRole("traveler");
                      setEmployeeSubRoute("");
                    }}
                  >
                    Traveler
                  </button>
                  <button
                    className={role === "employee" ? "active" : ""}
                    onClick={() => setRole("employee")}
                  >
                    Employee
                  </button>
                </div>
              </div>

              {role === "employee" && <EmployeeSubNav />}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="auth-form">
                <div className="input-group">
                  <label className="input-label">EMAIL</label>
                  <input
                    type="email"
                    placeholder="Your email here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group password-group">
                  <label className="input-label">PASSWORD</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="auth-btn">
                  SIGN IN
                </button>

                <p className="demo-note">
                  Every account gets a 14 day trail with no credit required to
                  signup
                </p>
              </form>
            </>
          ) : (
            <>
              <p className="signup-prompt">
                Already have an account?{" "}
                <span
                  className="sign-in-link"
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                  }}
                >
                  Sign in here
                </span>
                <span className="chevron"> →</span>
              </p>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="auth-form">
                <div className="input-group">
                  <label className="input-label">FULL NAME</label>
                  <input
                    type="text"
                    placeholder="Your full name here"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">USERNAME</label>
                  <input
                    type="text"
                    placeholder="Your username here"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group password-group">
                  <label className="input-label">PASSWORD</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group password-group">
                  <label className="input-label">CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="auth-btn">
                  CREATE ACCOUNT
                </button>

                <p className="demo-note">
                  Every account gets a 14 day trail with no credit required to
                  signup
                </p>
              </form>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <a href="#">Help</a>
          <span className="separator">•</span>
          <a href="#">Terms & Conditions</a>
          <span className="separator">•</span>
          <a href="#">Legal</a>
          <span className="separator">•</span>
          <a href="#">Contact</a>
        </div>
      </div>

      {/* RIGHT PANEL - BACKGROUND IMAGE */}
      <div className="login-right-panel"></div>
    </div>
  );
}

export default LoginPage;