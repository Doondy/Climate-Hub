import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🌍 Climate Hub</h1>
        <p className="tagline">Empowering Smart Climate Insights for Businesses</p>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/weather")}>
          <h2>🌦️ Live Weather</h2>
          <p>Monitor real-time conditions across the globe.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/forecast")}>
          <h2>📅 Forecast</h2>
          <p>Access accurate 7-day forecasts and data trends.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/alerts")}>
          <h2>🚨 Alerts</h2>
          <p>Receive timely climate and safety notifications.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/tripplanner")}>
          <h2>🗺️ Trip Planner</h2>
          <p>Plan smart travels with adaptive weather guidance.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/weathergraphs")}>
          <h2>📊 Past Weather</h2>
          <p>Analyze historical data for informed decisions.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/about")}>
          <h2>ℹ️ About</h2>
          <p>Discover our mission and innovative approach.</p>
        </div>
      </section>

      <footer className="dashboard-footer">
        <button className="logout-btn" onClick={() => navigate("/")}>
          🚪 Logout
        </button>
      </footer>
    </div>
  );
}

export default DashboardPage;