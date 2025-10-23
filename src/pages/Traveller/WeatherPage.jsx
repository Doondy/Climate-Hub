import React, { useState, useEffect } from "react";
import "../../styles/WeatherPage.css";

function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [news, setNews] = useState([]);

  const WEATHER_API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3";
  const NEWS_API_KEY = "pub_ea98e2df8ab942c6a71554c3d05b68bf";

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) setWeather(data);
      else setError("City not found. Please check the name.");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=en&country=us,gb,in`
        );
        const data = await response.json();
        if (data.results) setNews(data.results.slice(0, 6));
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="weather-page">
      <h1 className="weather-title">🌤 Global Weather & News Dashboard</h1>

      <div className="weather-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="weather-details">
            <p>🌡 Temperature: {weather.main.temp} °C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬 Wind Speed: {weather.wind.speed} m/s</p>
            <p>☁ Condition: {weather.weather[0].description}</p>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}

      <div className="news-section">
        <h2>📰 Latest Global News</h2>
        <div className="news-grid">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card">
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="news-image"
                  />
                )}
                <h3>{article.title}</h3>
                <p>{article.description || "No description available."}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More →
                </a>
              </div>
            ))
          ) : (
            <p>Loading news...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;