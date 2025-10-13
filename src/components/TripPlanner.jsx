import React, { useState } from "react";
import "../styles/TripPlanner.css";

function TripPlanner() {
  const [weather, setWeather] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Function to generate trip plans based on entered climate
  const handlePlan = (e) => {
    e.preventDefault(); // Prevent page reload

    let plans = [];

    switch (weather.trim().toLowerCase()) {
      case "sunny":
        plans = [
          { name: "Beach Trip 🏖️", link: "https://www.booking.com/beach-holidays" },
          { name: "Mountain Trek 🏔️", link: "https://www.booking.com/mountain-trekking" },
          { name: "Picnic in the Park 🌳", link: "https://www.eventbrite.com/d/online/picnic/" },
        ];
        break;
      case "rainy":
        plans = [
          { name: "Museum Visit 🖼️", link: "https://www.booking.com/museums" },
          { name: "Indoor Cafe ☕", link: "https://www.yelp.com/cafes" },
          { name: "Shopping Mall 🛍️", link: "https://www.tripadvisor.com/Shopping" },
        ];
        break;
      case "cold":
        plans = [
          { name: "Hill Station Stay ❄️", link: "https://www.booking.com/hill-stations" },
          { name: "Hot Springs ♨️", link: "https://www.booking.com/hot-springs" },
          { name: "Scenic Drive 🚗", link: "https://www.tripadvisor.com/ScenicDrives" },
        ];
        break;
      case "windy":
        plans = [
          { name: "Kite Festival 🪁", link: "https://www.eventbrite.com/d/online/kite-festival/" },
          { name: "Cliff Walk 🌬️", link: "https://www.tripadvisor.com/CliffWalks" },
          { name: "Lakeside Stroll 🌊", link: "https://www.tripadvisor.com/Lakes" },
        ];
        break;
      default:
        plans = [{ name: "Enter a valid weather condition!", link: "#" }];
    }

    setSuggestions(plans);
  };

  return (
    <div className="trip-container">
      <h2>🗺️ Weather-Based Trip Planner</h2>
      <p>Enter the current or forecasted weather condition:</p>

      {/* Form with styled input box */}
      <form onSubmit={handlePlan}>
        <input
          type="text"
          placeholder="Enter climate: Sunny, Rainy, Cold, Windy"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
            fontSize: "16px"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer"
          }}
        >
          Generate Trip Plan
        </button>
      </form>

      {/* Display trip suggestions */}
      <ul style={{ marginTop: "20px" }}>
        {suggestions.map((plan, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <a href={plan.link} target="_blank" rel="noopener noreferrer">
              {plan.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripPlanner;