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
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("Please enter email and password!");
      return;
    }

    if (role === "traveler") {
      localStorage.setItem("user", email);
      localStorage.setItem("role", "traveler");
      navigate("/traveller");
    } else if (role === "employee") {
      if (employeeSubRoute) {
        navigate(`/employee/${employeeSubRoute}`);
      } else {
        setError("Please select an Employee action (Profile, Reports, etc.)");
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
      <div className="login-card">
        <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>

        {/* LOGIN FORM */}
        {!isSignUp ? (
          <>
            <div className="role-tabs">
              <button
                className={role === "traveler" ? "active" : ""}
                onClick={() => {
                  setRole("traveler");
                  setEmployeeSubRoute("");
                }}
              >
                ✈️ Traveler
              </button>
              <button
                className={role === "employee" ? "active" : ""}
                onClick={() => {
                  setRole("employee");
                }}
              >
                👨‍💼 Employee
              </button>
            </div>

            {role === "employee" && <EmployeeSubNav />}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              <button type="submit" className="sign-in-btn">
                Sign In
              </button>
            </form>

            <p className="signup-prompt">Don’t have an account?</p>
            <button
              className="sign-up-btn"
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
            >
              ➕ Sign Up
            </button>

            <p className="demo-note">
              **Demo:** Use any email/password combination to sign in
            </p>
          </>
        ) : (
          // SIGN UP FORM
          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="sign-in-btn">
              Create Account
            </button>

            <p className="signup-prompt">Already have an account?</p>
            <button
              className="sign-up-btn"
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
            >
              🔙 Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;