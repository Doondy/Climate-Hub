import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from "react-router-dom";
import "../../styles/TravellerDashboard.css";

function TravellerDashboard() {
  const [travellers, setTravellers] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/travellers")
  //     .then((res) => setTravellers(res.data))
  //     .catch((err) => console.error("Error fetching travellers:", err));
  // }, []);

  return (
    <div className="traveller-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Traveller Dashboard</h1>
        <p>Explore, Plan & Stay Updated 🌍</p>
      </header>

      {/* Navigation */}
      <nav className="traveller-nav">
        <Link to="/traveller/memories">
          <span className="nav-icon">📷</span>
          Memories
        </Link>
        <Link to="/traveller/weather">
          <span className="nav-icon">🌤️</span>
          Weather
        </Link>
        <Link to="/traveller/forecast">
          <span className="nav-icon">📊</span>
          Forecast
        </Link>
        <Link to="/traveller/about">
          <span className="nav-icon">ℹ️</span>
          About
        </Link>
        <Link to="/traveller/alert">
          <span className="nav-icon">⚠️</span>
          Alert
        </Link>
        <Link to="/traveller/tripplanner">
          <span className="nav-icon">✈️</span>
          Trip Planner
        </Link>
        <Link to="/traveller/weathergraphs">
          <span className="nav-icon">📈</span>
          Weather Graphs
        </Link>
      </nav>

      {/* Content Section */}
      <section className="traveller-content">
        <h3>Registered Travellers</h3>
        <div className="traveller-list">
          {travellers.length > 0 ? (
            travellers.map((t) => (
              <div className="traveller-card" key={t._id}>
                <h4>{t.name}</h4>
                <p>
                  Destination: <span>{t.destination}</span>
                </p>
                <p>
                  Date: <span>{t.date}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="no-data">No travellers registered yet.</p>
          )}
        </div>

        {/* Nested Route */}
        <Outlet />
      </section>
    </div>
  );
}

export default TravellerDashboard;