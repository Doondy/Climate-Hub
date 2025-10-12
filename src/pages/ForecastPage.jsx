import React, { useState } from "react";
import axios from "axios";
import "../pages/ForecastPage.css";

function ForecastPage() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3";

  const fetchForecast = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setError("");

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      setForecastData(response.data.list);
    } catch (err) {
      setError("City not found or network error.");
      setForecastData([]);
    }
  };

  return (
    <div className="forecast-page">
      <h1>📅 Weather Forecast</h1>

      <div className="forecast-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchForecast}>Get Forecast</button>
      </div>

      {error && <p className="error">{error}</p>}

      {forecastData.length > 0 && (
        <div className="forecast-cards">
          {forecastData.map((item) => (
            <div key={item.dt} className="forecast-card">
              <p>
                <strong>{new Date(item.dt * 1000).toLocaleString()}</strong>
              </p>
              <p>🌡 Temp: {item.main.temp} °C</p>
              <p>💧 Humidity: {item.main.humidity}%</p>
              <p>🌬 Wind: {item.wind.speed} m/s</p>
              <p>☁ Condition: {item.weather[0].description}</p>
              <p>🌧 Rainfall: {item.rain?.["3h"] ?? 0} mm</p> {/* ✅ Add rainfall */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ForecastPage;