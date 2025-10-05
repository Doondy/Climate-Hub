import React from "react";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">🌍 About Climate Hub</h1>
        <p className="about-text">
          Climate Hub is your smart companion for understanding weather patterns 
          and climate changes. Our mission is to empower individuals, businesses, 
          and communities with accurate, real-time weather insights so that you 
          can make informed decisions every day.
        </p>

        <p className="about-text">
          Whether you're planning a trip, managing agricultural activities, or 
          just curious about the weather, Climate Hub provides user-friendly 
          forecasts, analytics, and environmental tips to help you stay prepared 
          and sustainable.
        </p>

        <p className="about-text">
          We care about our planet and aim to bring awareness about climate 
          change while promoting green and sustainable living practices. 
          Join us in creating a better tomorrow!
        </p>
      </div>
    </div>
  );
}

export default About;