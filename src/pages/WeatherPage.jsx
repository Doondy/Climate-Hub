import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Make sure this CSS contains all the styles below

function WeatherPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || "Guest";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather from API
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiKey = "22c33f3b11fe3fe3f2588df94e90f2e3"; // Replace with your valid API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        setError(data.message || "City not found");
        setWeather(null);
      }
    } catch {
      setError("Error fetching weather data");
      setWeather(null);
    }

    setLoading(false);
  };

  // Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="animated-bg weather-page">
      <div className="flowers-overlay"></div>

      <h1 className="title">🌍 Climate Hub</h1>
      <h2 className="subtitle">Welcome, {username}!</h2>

      {/* Centered Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading && <p className="loading">Fetching weather...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="glass-card weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>🌤️ {weather.weather[0].description}</p>
          <p>💨 Wind: {weather.wind.speed} m/s</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      {/* Ads Section */}
      <div className="ads-section">
        <a href="https://www.nationalgeographic.com/travel" target="_blank" rel="noopener noreferrer" className="ad-banner">
          🚀 Explore 8K World – Future Travel Ads
        </a>
        <a href="https://weather.com" target="_blank" rel="noopener noreferrer" className="ad-banner">
          🌐 Experience Weather in Ultra-HD
        </a>
        <a href="https://www.lonelyplanet.com" target="_blank" rel="noopener noreferrer" className="ad-banner">
          ✨ Smart Tourism powered by Climate Hub
        </a>
      </div>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default WeatherPage;