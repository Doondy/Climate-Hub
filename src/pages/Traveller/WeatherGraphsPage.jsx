import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherChart from "../../components/WeatherChart";
import "../../styles/WeatherGraphsPage.css";

function WeatherGraphsPage() {
  const [city, setCity] = useState("");
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [bgClass, setBgClass] = useState("bg-clear");
  const [transactions, setTransactions] = useState([]); // 🧾 Transaction Table

  const WEATHER_API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3";
  const NEWS_API_KEY = "pub_ea98e2df8ab942c6a71554c3d05b68bf";

  // 🌦️ Master Table Data
  const masterTable = [
    { parameter: "Temperature", unit: "°C", description: "Average air temperature" },
    { parameter: "Humidity", unit: "%", description: "Moisture content in the air" },
    { parameter: "Rainfall", unit: "mm", description: "Rain volume in last 3 hours" },
  ];

  const fetchWeatherData = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setError("");
    setLoading(true);
    setTempData([]);
    setHumidityData([]);
    setRainData([]);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const list = response.data.list;

      // Update background
      const weatherMain = list[0].weather[0].main.toLowerCase();
      if (weatherMain.includes("cloud")) setBgClass("bg-cloudy");
      else if (weatherMain.includes("rain")) setBgClass("bg-rain");
      else if (weatherMain.includes("thunder")) setBgClass("bg-thunder");
      else if (weatherMain.includes("snow")) setBgClass("bg-snow");
      else if (weatherMain.includes("fog") || weatherMain.includes("mist"))
        setBgClass("bg-fog");
      else if (weatherMain.includes("clear") && list[0].dt_txt.includes("18:00"))
        setBgClass("bg-sunset");
      else if (weatherMain.includes("clear")) setBgClass("bg-clear");
      else setBgClass("bg-night");

      // Prepare chart data
      const tempGraph = list.slice(0, 7).map((item) => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        value: item.main.temp,
      }));

      const humidityGraph = list.slice(0, 7).map((item) => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        value: item.main.humidity,
      }));

      const rainGraph = list.slice(0, 7).map((item) => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        value: item.rain?.["3h"] ?? 0,
      }));

      setTempData(tempGraph);
      setHumidityData(humidityGraph);
      setRainData(rainGraph);

      // 🧾 Add Transaction Entry
      setTransactions((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          city: city,
          weather: weatherMain,
          date: new Date().toLocaleString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("City not found or network error.");
    } finally {
      setLoading(false);
    }
  };

  // 📰 Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=en&country=us,gb,in`
        );
        const data = await res.json();
        if (data.results) setNews(data.results.slice(0, 6));
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className={`weather-graphs-page ${bgClass}`}>
      <h1 className="title">📊 Weather Trends & Insights</h1>
      <p className="subtitle">Visualize forecast data and stay updated with global headlines.</p>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeatherData}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Fetching data...</p>}

      {/* Charts Section */}
      <div className="charts-section">
        {tempData.length > 0 && (
          <WeatherChart data={tempData} title="Temperature (°C) over Next 7 Forecasts" />
        )}
        {humidityData.length > 0 && (
          <WeatherChart data={humidityData} title="Humidity (%) over Next 7 Forecasts" />
        )}
        {rainData.length > 0 && (
          <WeatherChart data={rainData} title="Rainfall (mm) over Next 7 Forecasts" />
        )}
      </div>

      {/* 🌦️ Master Table */}
      <div className="master-table">
        <h2>🌍 Master Table — Weather Parameters</h2>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Unit</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {masterTable.map((row, index) => (
              <tr key={index}>
                <td>{row.parameter}</td>
                <td>{row.unit}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧾 Transaction Table */}
      <div className="transaction-table">
        <h2>🧾 Transaction Table — User Searches</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>City</th>
              <th>Main Weather</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.city}</td>
                <td>{tx.weather}</td>
                <td>{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📰 News Section */}
      <div className="news-section">
        <h2>📰 Global Business & Climate News</h2>
        <div className="news-grid">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card">
                {article.image_url && (
                  <img src={article.image_url} alt={article.title} className="news-image" />
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

export default WeatherGraphsPage;