import React, { useState } from "react";
import axios from "axios";
import "../styles/ForecastPage.css";

function ForecastPage() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3";

  const fetchForecast = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Group forecast data by date (for a 5-day summary)
      const groupedData = [];
      const uniqueDays = new Set();

      response.data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDays.has(date)) {
          uniqueDays.add(date);
          groupedData.push(item);
        }
      });

      setForecastData(groupedData);
    } catch (err) {
      setError("City not found or network error.");
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forecast-page">
      <h1>📅 5-Day Weather Forecast</h1>

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
      {loading && <p className="loading">Loading forecast...</p>}

      {forecastData.length > 0 && (
        <div className="forecast-cards">
          {forecastData.map((item) => (
            <div key={item.dt} className="forecast-card">
              <h3>{new Date(item.dt * 1000).toLocaleDateString()}</h3>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
              />
              <p>🌡 {item.main.temp} °C</p>
              <p>💧 {item.main.humidity}% humidity</p>
              <p>🌬 {item.wind.speed} m/s wind</p>
              <p>☁ {item.weather[0].description}</p>
              <p>🌧 Rain: {item.rain?.["3h"] ?? 0} mm</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ForecastPage;