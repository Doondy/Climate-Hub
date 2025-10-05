import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import "./ForecastPage.css";

function ForecastPage() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3"; 

  const fetchForecast = async () => {
    if (!city) return setError("Enter a city to check forecast.");
    setLoading(true);
    setError("");
    setForecast([]);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === "200") {
        // Pick one forecast per day (every 8th 3-hour reading)
        const daily = data.list.filter((_, index) => index % 8 === 0);
        setForecast(daily);
      } else {
        setError("City not found!");
      }
    } catch {
      setError("Unable to fetch forecast data.");
    }
    setLoading(false);
  };

  return (
    <div className="forecast-page">
      <Header />
      <SearchBar city={city} setCity={setCity} onSearch={fetchForecast} />

      {loading && <Loader />}
      {error && <p className="error">{error}</p>}

      <div className="forecast-grid">
        {forecast.map((day, i) => (
          <div key={i} className="forecast-card">
            <p>{new Date(day.dt_txt).toDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
            <p>🌡️ {day.main.temp}°C</p>
            <p>{day.weather[0].description}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default ForecastPage;