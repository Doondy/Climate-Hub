import React, { useState, useEffect } from "react";
import "../../styles/ForecastPage.css";
import { getGlobalNews } from "../../services/newsService";
import { getForecast } from "../../services/forecastService";

function ForecastPage() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Fetch Global News on Page Load
  useEffect(() => {
    const fetchNews = async () => {
      const articles = await getGlobalNews();
      setNews(articles);
    };
    fetchNews();
  }, []);

  // Fetch Forecast Data
  const fetchForecast = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setError("");
    setLoadingForecast(true);

    const data = await getForecast(city);

    if (data && data.list) {
      const groupedData = [];
      const uniqueDays = new Set();

      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDays.has(date)) {
          uniqueDays.add(date);
          groupedData.push(item);
        }
      });

      setForecastData(groupedData);
    } else {
      setError("City not found or network error.");
      setForecastData([]);
    }

    setLoadingForecast(false);
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
      {loadingForecast && <p className="loading">Loading forecast...</p>}

      {/* Weather Forecast Cards */}
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

      {/* Live Global News Section */}
      <h2>📰 Live Global News</h2>
      <div className="news-cards">
        {news.length === 0 && <p>Loading news...</p>}
        {news.map((article, idx) => (
          <div key={idx} className="news-card">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="news-image"
              />
            )}
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              <h3>{article.title}</h3>
            </a>
            <p>{article.description || "No description available."}</p>
            <p className="published">
              {article.pubDate
                ? new Date(article.pubDate).toLocaleString()
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastPage;