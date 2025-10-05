import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>🌍 Climate Hub Dashboard</h1>
      <p>Select an option:</p>

      <div className="dashboard-buttons">
        <button onClick={() => navigate("/tripplanner")}>
          🗺️ Plan a Trip
        </button>
        <button onClick={() => navigate("/weathergraphs")}>
          📊 Past Weather Graphs
        </button>
        <button onClick={() => navigate("/weather")}>
          🌦️ Live Weather
        </button>
        <button onClick={() => navigate("/forecast")}>
          📅 Forecast
        </button>
        <button onClick={() => navigate("/about")}>
          ℹ️ About
        </button>
        <button onClick={() => navigate("/")}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;