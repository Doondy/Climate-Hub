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

  // Master Table State
  const [masterData, setMasterData] = useState([]);
  const [masterForm, setMasterForm] = useState({
    cityName: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  // Transaction Table State
  const [transactionData, setTransactionData] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    cityName: "",
    date: "",
    action: "",
  });

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

  // --- MASTER FORM HANDLERS ---
  const handleMasterChange = (e) => {
    const { name, value } = e.target;
    setMasterForm({ ...masterForm, [name]: value });
  };

  const handleAddMaster = (e) => {
    e.preventDefault();
    if (!masterForm.cityName.trim()) return;

    const newEntry = {
      ...masterForm,
      id: Date.now(),
    };
    setMasterData([...masterData, newEntry]);
    setMasterForm({ cityName: "", country: "", latitude: "", longitude: "" });
  };

  // --- TRANSACTION FORM HANDLERS ---
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm({ ...transactionForm, [name]: value });
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!transactionForm.cityName.trim()) return;

    const newTxn = {
      ...transactionForm,
      id: Date.now(),
    };
    setTransactionData([...transactionData, newTxn]);
    setTransactionForm({ cityName: "", date: "", action: "" });
  };

  return (
    <div className="forecast-page">
      <h1>📅 5-Day Weather Forecast</h1>

      {/* Forecast Search Form */}
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

      {/* Forecast Cards */}
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

      {/* MASTER FORM & TABLE */}
      <div className="master-section">
        <h2>🏙️ City Information</h2>
        <form className="master-form" onSubmit={handleAddMaster}>
          <input
            type="text"
            name="cityName"
            placeholder="City Name"
            value={masterForm.cityName}
            onChange={handleMasterChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={masterForm.country}
            onChange={handleMasterChange}
          />
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={masterForm.latitude}
            onChange={handleMasterChange}
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={masterForm.longitude}
            onChange={handleMasterChange}
          />
          <button type="submit">Add City</button>
        </form>

        <table className="data-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>Country</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {masterData.map((row) => (
              <tr key={row.id}>
                <td>{row.cityName}</td>
                <td>{row.country}</td>
                <td>{row.latitude}</td>
                <td>{row.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TRANSACTION FORM & TABLE */}
      <div className="transaction-section">
        <h2>🧾 User Forecast Actions</h2>
        <form className="transaction-form" onSubmit={handleAddTransaction}>
          <input
            type="text"
            name="cityName"
            placeholder="City Name"
            value={transactionForm.cityName}
            onChange={handleTransactionChange}
            required
          />
          <input
            type="date"
            name="date"
            value={transactionForm.date}
            onChange={handleTransactionChange}
            required
          />
          <input
            type="text"
            name="action"
            placeholder="Action (e.g., Searched, Viewed)"
            value={transactionForm.action}
            onChange={handleTransactionChange}
            required
          />
          <button type="submit">Add Transaction</button>
        </form>

        <table className="data-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.cityName}</td>
                <td>{txn.date}</td>
                <td>{txn.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>📰 Global News</h2>
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