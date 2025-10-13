import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🌍 Climate Hub</h1>
        <p>Your gateway to smart, weather-based decisions.</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/weather")}>
          <h2>🌦️ Live Weather</h2>
          <p>Check current conditions anywhere in the world.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/forecast")}>
          <h2>📅 Forecast</h2>
          <p>View 7-day weather forecasts and temperature trends.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/alerts")}>
          <h2>🚨 Alerts</h2>
          <p>Stay informed with real-time climate and safety alerts.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/tripplanner")}>
          <h2>🗺️ Trip Planner</h2>
          <p>Plan your trips smartly based on live weather updates.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/weathergraphs")}>
          <h2>📊 Past Weather</h2>
          <p>Analyze historical weather data with detailed graphs.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/about")}>
          <h2>ℹ️ About</h2>
          <p>Learn more about Climate Hub and its mission.</p>
        </div>
      </div>

      <div className="dashboard-footer">
        <button className="logout-btn" onClick={() => navigate("/")}>🚪 Logout</button>
      </div>
    </div>
  );
}

export default DashboardPage;