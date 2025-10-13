import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Background layers */}
      <div className="sky">
        <div className="sun"></div>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>

      {/* Birds animation */}
      <div className="bird bird1"></div>
      <div className="bird bird2"></div>

      {/* Foreground content */}
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1>Welcome to <span>Climate Hub</span></h1>
        <p>
          Your all-in-one platform for real-time weather updates,
          sustainable trip planning, and climate insights — stay informed, travel smart.
        </p>
        <button onClick={() => navigate("/login")}>Get Started</button>
      </motion.div>

      {/* Ground section */}
      <div className="grass"></div>
    </div>
  );
}

export default HomePage;