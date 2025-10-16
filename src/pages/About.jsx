import React from "react";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">🌍 About Climate Hub</h1>

        <p className="about-intro">
          <strong>Climate Hub</strong> is a professional weather intelligence platform 
          designed to empower businesses, travelers, and organizations with accurate, 
          real-time, and data-driven climate insights.
        </p>

        <div className="about-section">
          <h2>🌤 Our Mission</h2>
          <p>
            Our mission is to help people and enterprises make informed decisions 
            by transforming complex weather data into clear, actionable insights. 
            From daily commuters to logistics companies, we provide reliable 
            weather analytics for strategic planning and risk management.
          </p>
        </div>

        <div className="about-section">
          <h2>📊 What We Offer</h2>
          <ul>
            <li> Real-time global weather monitoring</li>
            <li> 7-day and extended forecast reports</li>
            <li> Climate-based travel and business planning</li>
            <li> Historical weather data visualization and trends</li>
            <li> Integration of live global news and alerts</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>🌱 Our Vision</h2>
          <p>
            We aim to build a smarter, safer, and more sustainable future by 
            combining technology, data analytics, and environmental awareness. 
            At Climate Hub, we believe informed actions today lead to a 
            resilient and sustainable tomorrow.
          </p>
        </div>

        <div className="about-section">
          <h2>🤝 Join Us</h2>
          <p>
            Whether you’re an environmental researcher, business strategist, 
            or simply passionate about climate intelligence, 
            <strong> Climate Hub</strong> invites you to collaborate, innovate, and 
            contribute toward a climate-conscious world.
          </p>
        </div>

        <footer className="about-footer">
          <p>© {new Date().getFullYear()} Climate Hub | Empowering Weather Intelligence</p>
        </footer>
      </div>
    </div>
  );
}

export default About;