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

  // Traveller Report Form State
  const [reportData, setReportData] = useState([]);
  const [reportForm, setReportForm] = useState({
    travellerName: "",
    city: "",
    weatherCondition: "",
    experience: "",
    date: "",
  });
  const [editingReportId, setEditingReportId] = useState(null);

  // Transaction Table State
  const [transactionData, setTransactionData] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    cityName: "",
    date: "",
    action: "",
  });
  const [editingTransactionId, setEditingTransactionId] = useState(null);

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

  // --- REPORT FORM HANDLERS ---
  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportForm({ ...reportForm, [name]: value });
  };

  const handleAddOrUpdateReport = (e) => {
    e.preventDefault();
    if (!reportForm.travellerName.trim() || !reportForm.city.trim()) return;

    if (editingReportId) {
      setReportData(
        reportData.map((item) =>
          item.id === editingReportId ? { ...item, ...reportForm } : item
        )
      );
      setEditingReportId(null);
    } else {
      const newReport = { ...reportForm, id: Date.now() };
      setReportData([...reportData, newReport]);
    }

    setReportForm({
      travellerName: "",
      city: "",
      weatherCondition: "",
      experience: "",
      date: "",
    });
  };

  const handleEditReport = (id) => {
    const report = reportData.find((item) => item.id === id);
    if (report) {
      setReportForm(report);
      setEditingReportId(id);
    }
  };

  const handleDeleteReport = (id) => {
    setReportData(reportData.filter((item) => item.id !== id));
  };

  // --- TRANSACTION FORM HANDLERS ---
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm({ ...transactionForm, [name]: value });
  };

  const handleAddOrUpdateTransaction = (e) => {
    e.preventDefault();
    if (!transactionForm.cityName.trim()) return;

    if (editingTransactionId) {
      setTransactionData(
        transactionData.map((item) =>
          item.id === editingTransactionId ? { ...item, ...transactionForm } : item
        )
      );
      setEditingTransactionId(null);
    } else {
      const newTxn = { ...transactionForm, id: Date.now() };
      setTransactionData([...transactionData, newTxn]);
    }

    setTransactionForm({ cityName: "", date: "", action: "" });
  };

  const handleEditTransaction = (id) => {
    const txn = transactionData.find((item) => item.id === id);
    if (txn) {
      setTransactionForm(txn);
      setEditingTransactionId(id);
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactionData(transactionData.filter((item) => item.id !== id));
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

      {/* 🧍‍♂️ TRAVELLER REPORT FORM */}
      <div className="report-section">
        <h2>🧍‍♂️ Traveller Report Form</h2>
        <form className="report-form" onSubmit={handleAddOrUpdateReport}>
          <input
            type="text"
            name="travellerName"
            placeholder="Traveller Name"
            value={reportForm.travellerName}
            onChange={handleReportChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={reportForm.city}
            onChange={handleReportChange}
            required
          />
          <input
            type="text"
            name="weatherCondition"
            placeholder="Weather Condition"
            value={reportForm.weatherCondition}
            onChange={handleReportChange}
          />
          <textarea
            name="experience"
            placeholder="Describe your experience..."
            value={reportForm.experience}
            onChange={handleReportChange}
            rows={3}
          />
          <input
            type="date"
            name="date"
            value={reportForm.date}
            onChange={handleReportChange}
            required
          />
          <button type="submit">
            {editingReportId ? "Update Report" : "Submit Report"}
          </button>
        </form>

        {/* Report Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Traveller Name</th>
              <th>City</th>
              <th>Weather</th>
              <th>Experience</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr key={row.id}>
                <td>{row.travellerName}</td>
                <td>{row.city}</td>
                <td>{row.weatherCondition}</td>
                <td>{row.experience}</td>
                <td>{row.date}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditReport(row.id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteReport(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TRANSACTION FORM & TABLE */}
      <div className="transaction-section">
        <h2>🧾 User Forecast Actions</h2>
        <form className="transaction-form" onSubmit={handleAddOrUpdateTransaction}>
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
          <button type="submit">
            {editingTransactionId ? "Update Action" : "Add Transaction"}
          </button>
        </form>

        <table className="data-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>Date</th>
              <th>Action</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.cityName}</td>
                <td>{txn.date}</td>
                <td>{txn.action}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditTransaction(txn.id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteTransaction(txn.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GLOBAL NEWS SECTION */}
      <h2>📰 Global News</h2>
      <div className="news-cards">
        {news.length === 0 && <p>Loading news...</p>}
        {news.map((article, idx) => (
          <div key={idx} className="news-card">
            {article.image_url && (
              <img src={article.image_url} alt={article.title} className="news-image" />
            )}
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              <h3>{article.title}</h3>
            </a>
            <p>{article.description || "No description available."}</p>
            <p className="published">
              {article.pubDate ? new Date(article.pubDate).toLocaleString() : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastPage;