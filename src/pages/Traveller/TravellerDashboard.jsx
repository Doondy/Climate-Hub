import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from "react-router-dom";
import "../../styles/TravellerDashboard.css";

function TravellerDashboard() {
  const [travellers, setTravellers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/travellers")
      .then(res => setTravellers(res.data))
      .catch(err => console.error("Error fetching travellers:", err));
  }, []);

  return (
    <div className="traveller-dashboard">
      <h1>Traveller Dashboard</h1>

      <nav className="traveller-nav">
        <Link to="/traveller/weather">Weather</Link>
        <Link to="/traveller/forecast">Forecast</Link>
        <Link to="/traveller/about">About</Link>
        <Link to="/traveller/alert">Alert</Link>
        <Link to="/traveller/tripplanner">Trip Planner</Link>
        <Link to="/traveller/weathergraphs">Weather Graphs</Link>
      </nav>

      <div className="traveller-content">
        <h3>Registered Travellers:</h3>
        <ul>
          {travellers.map((t) => (
            <li key={t._id}>{t.name} - {t.destination} ({t.date})</li>
          ))}
        </ul>
        <Outlet />
      </div>
    </div>
  );
}

export default TravellerDashboard;