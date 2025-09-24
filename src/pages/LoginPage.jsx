import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      navigate("/weather", { state: { username } });
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="animated-bg">
      <div className="glass-card login-card">
        {/* Logo */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1116/1116453.png" 
          alt="Logo"
          className="login-logo"
        />
        <h1>🔐 Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-box"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
          />
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;