import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Sky & sun */}
      <div className="sky">
        <div className="sun"></div>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>

      {/* Foreground content */}
      <div className="home-content">
        <h1>Welcome to Climate Hub</h1>
        <p>Explore weather insights and plan trips in harmony with nature.</p>
        <button onClick={() => navigate("/login")}>Get Started</button>
      </div>

      {/* Grass / ground */}
      <div className="grass"></div>

      {/* Optional: birds animation */}
      <div className="bird bird1"></div>
      <div className="bird bird2"></div>
    </div>
  );
}

export default HomePage;
