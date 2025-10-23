import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Background */}
      <div className="sky">
        <div className="sun"></div>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>

      {/* 🎈 Floating Balloons */}
      <div className="balloon balloon1"></div>
      <div className="balloon balloon2"></div>
      <div className="balloon balloon3"></div>
      <div className="balloon balloon4"></div>

      {/* Content */}
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1>
          Welcome to <span className="highlight">Climate Hub</span> 🌍
        </h1>
        <p className="tagline">
          Track the weather, plan eco-friendly trips, and stay connected with
          our changing climate — all in one hub!
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="get-started-btn"
          onClick={() => navigate("/login")}
        >
          Get Started 🌤
        </motion.button>
      </motion.div>

      {/* Ground */}
      <div className="grass"></div>

      {/* Footer */}
      <footer className="footer-text">Made with 💚 by Climate Hub</footer>
    </div>
  );
}

export default HomePage;