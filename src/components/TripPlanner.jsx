import React, { useState } from "react";
import "../styles/TripPlanner.css";

function TripPlanner() {
  const [weather, setWeather] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handlePlan = () => {
    let plans = [];

    switch (weather.toLowerCase()) {
      case "sunny":
        plans = ["Beach Trip 🏖️", "Mountain Trek 🏔️", "Picnic in the Park 🌳"];
        break;
      case "rainy":
        plans = ["Museum Visit 🖼️", "Indoor Cafe ☕", "Shopping Mall 🛍️"];
        break;
      case "cold":
        plans = ["Hill Station Stay ❄️", "Hot Springs ♨️", "Scenic Drive 🚗"];
        break;
      case "windy":
        plans = ["Kite Festival 🪁", "Cliff Walk 🌬️", "Lakeside Stroll 🌊"];
        break;
      default:
        plans = ["Enter a valid weather condition!"];
    }

    setSuggestions(plans);
  };

  return (
    <div className="trip-container">
      <h2>🗺️ Weather-Based Trip Planner</h2>
      <p>Enter the current or forecasted weather condition:</p>

      <input
        type="text"
        placeholder="e.g., Sunny, Rainy, Cold"
        value={weather}
        onChange={(e) => setWeather(e.target.value)}
      />
      <button onClick={handlePlan}>Generate Trip Plan</button>

      <ul>
        {suggestions.map((plan, index) => (
          <li key={index}>{plan}</li>
        ))}
      </ul>
    </div>
  );
}

export default TripPlanner;