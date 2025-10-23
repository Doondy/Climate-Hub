import React, { useState } from "react";
import "../../styles/AlertPage.css"; 

const AlertPage = () => {
  const allAlerts = [
    { id: 1, title: "Heavy Rainfall Warning", level: "Severe", region: "Mumbai", date: "13 Oct 2025" },
    { id: 2, title: "High UV Index", level: "Moderate", region: "Chennai", date: "13 Oct 2025" },
    { id: 3, title: "Heatwave Alert", level: "High", region: "Delhi", date: "13 Oct 2025" },
    { id: 4, title: "Thunderstorm Alert", level: "High", region: "Coimbatore", date: "13 Oct 2025" }, // Added Coimbatore
  ];

  const [alerts, setAlerts] = useState(allAlerts);
  const [region, setRegion] = useState("");
  const [level, setLevel] = useState("");

  const handleFilter = (e) => {
    e.preventDefault();
    const filtered = allAlerts.filter((alert) => {
      const regionMatch = region ? alert.region.toLowerCase().includes(region.toLowerCase()) : true;
      const levelMatch = level ? alert.level.toLowerCase() === level.toLowerCase() : true;
      return regionMatch && levelMatch;
    });
    setAlerts(filtered);
  };

  const handleReset = () => {
    setAlerts(allAlerts);
    setRegion("");
    setLevel("");
  };

  return (
    <div className="alert-page">
      <h1>Weather Alerts</h1>

      {/* Form to filter alerts */}
      <form className="alert-form" onSubmit={handleFilter}>
        <input
          type="text"
          placeholder="Filter by region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          <option value="Severe">Severe</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">Filter</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${alert.level.toLowerCase()}`}>
              <h3>{alert.title}</h3>
              <p><strong>Region:</strong> {alert.region}</p>
              <p><strong>Level:</strong> {alert.level}</p>
              <p><strong>Date:</strong> {alert.date}</p>
            </div>
          ))
        ) : (
          <p>No alerts found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default AlertPage;