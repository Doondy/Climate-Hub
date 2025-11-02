import React, { useState, useEffect } from "react";
import { saveTransaction, getTransactions } from "../../../backend/services/transactionService";
import "../../styles/TripPlanner.css";

function TripPlanner() {
  const [weather, setWeather] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [transactions, setTransactions] = useState([]); // Transaction Table Data

  const masterTable = [
    {weather: "Sunny", plans: [
      { name: "Beach Trip 🏖️", link: "https://www.booking.com/beach-holidays" },
      { name: "Mountain Trek 🏔️", link: "https://www.booking.com/mountain-trekking" },
      { name: "Picnic in the Park 🌳", link: "https://www.eventbrite.com/d/online/picnic/" },
    ]},
    {weather: "Rainy", plans: [
      { name: "Museum Visit 🖼️", link: "https://www.booking.com/museums" },
      { name: "Indoor Cafe ☕", link: "https://www.yelp.com/cafes" },
      { name: "Shopping Mall 🛍️", link: "https://www.tripadvisor.com/Shopping" },
    ]},
    {weather: "Cold", plans: [
      { name: "Hill Station Stay ❄️", link: "https://www.booking.com/hill-stations" },
      { name: "Hot Springs ♨️", link: "https://www.booking.com/hot-springs" },
      { name: "Scenic Drive 🚗", link: "https://www.tripadvisor.com/ScenicDrives" },
    ]},
    {weather: "Windy", plans: [
      { name: "Kite Festival 🪁", link: "https://www.eventbrite.com/d/online/kite-festival/" },
      { name: "Cliff Walk 🌬️", link: "https://www.tripadvisor.com/CliffWalks" },
      { name: "Lakeside Stroll 🌊", link: "https://www.tripadvisor.com/Lakes" },
    ]},
  ];

  useEffect(() => {
    // On mount, fetch transaction history
    getTransactions().then((res) => setTransactions(res.data));
  }, []);

  const handlePlan = async (e) => {
    e.preventDefault();

    const inputWeather = weather.trim().toLowerCase();
    const foundWeather = masterTable.find(
      (item) => item.weather.toLowerCase() === inputWeather
    );

    if (foundWeather) {
      setSuggestions(foundWeather.plans);

      const newTransaction = {
        weather: foundWeather.weather,
        timestamp: new Date().toLocaleString(),
      };

      await saveTransaction(newTransaction);

      // Fetch the updated transaction list from backend
      const res = await getTransactions();
      setTransactions(res.data);
    } else {
      setSuggestions([{ name: "Enter a valid weather condition!", link: "#" }]);
    }
  };

  return (
    <div className="trip-container">
      <div className="trip-content">
        <h2>🗺️ Weather-Based Trip Planner</h2>
        <p>Enter the current or forecasted weather condition:</p>
        <form className="trip-form" onSubmit={handlePlan}>
          <input
            type="text"
            placeholder="Sunny, Rainy, Cold, Windy"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          />
          <button type="submit">Generate Trip Plan</button>
        </form>
        {/* Suggestions */}
        <ul className="trip-list">
          {suggestions.map((plan, index) => (
            <li key={index}>
              <a href={plan.link} target="_blank" rel="noopener noreferrer">
                {plan.name}
              </a>
            </li>
          ))}
        </ul>
        {/* Master Table */}
        <div className="master-table">
          <h3>🌦️ Weather Plans</h3>
          <table>
            <thead>
              <tr>
                <th>Weather</th>
                <th>Available Plans</th>
              </tr>
            </thead>
            <tbody>
              {masterTable.map((item, index) => (
                <tr key={index}>
                  <td>{item.weather}</td>
                  <td>
                    {item.plans.map((p, i) => (
                      <div key={i}>{p.name}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Transaction History Table */}
        <div className="transaction-table">
          <h3>🧾 User Inputs</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Weather Entered</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{tx.weather}</td>
                  <td>{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="trip-footer">
        © 2025 Climate Hub | Designed by Chandolu Doondy Sai Krishna
      </footer>
    </div>
  );
}

export default TripPlanner;