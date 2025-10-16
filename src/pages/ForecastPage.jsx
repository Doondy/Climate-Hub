import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ForecastPage.css";

function ForecastPage() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);

  const WEATHER_API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3";
  const NEWS_API_KEY = "76d22e87-7f27-4663-aefd-bb5d07427731";

  // Fetch 5-day weather forecast
  const fetchForecast = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );

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

  // Fetch live news using NewsAPI
  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?language=en&category=general&pageSize=6&apiKey=${NEWS_API_KEY}`
      );
      if (response.data.articles) {
        setNews(response.data.articles);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setNews([]);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="forecast-page">
      <header className="forecast-header">
        <h1>📅 5-Day Weather Forecast</h1>
        <p>Plan your week with precise weather updates and latest news.</p>
      </header>

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
              <p>🌡 Temperature: {item.main.temp} °C</p>
              <p>💧 Humidity: {item.main.humidity}%</p>
              <p>🌬 Wind: {item.wind.speed} m/s</p>
              <p>☁ {item.weather[0].description}</p>
              <p>🌧 Rain: {item.rain?.["3h"] ?? 0} mm</p>
            </div>
          ))}
        </div>
      )}

      {/* News Section */}
      <section className="news-section">
        <h2>📰 Latest News</h2>
        <div className="news-list">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} />
                )}
                <div className="news-content">
                  <h4>{article.title}</h4>
                  <p>{article.description || "No description available."}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No news available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ForecastPage;