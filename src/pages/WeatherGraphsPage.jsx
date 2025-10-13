import React, { useState } from "react";
import axios from "axios";
import WeatherChart from "../components/WeatherChart";
import "../styles/WeatherGraphsPage.css";

function WeatherGraphsPage() {
  const [city, setCity] = useState("");
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgClass, setBgClass] = useState("bg-clear");

  const API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3";

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
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const list = response.data.list;

      // Update background based on first forecast's weather
      const weatherMain = list[0].weather[0].main.toLowerCase();
      if (weatherMain.includes("cloud")) setBgClass("bg-cloudy");
      else if (weatherMain.includes("rain")) setBgClass("bg-rain");
      else if (weatherMain.includes("thunder")) setBgClass("bg-thunder");
      else if (weatherMain.includes("snow")) setBgClass("bg-snow");
      else if (weatherMain.includes("fog") || weatherMain.includes("mist")) setBgClass("bg-fog");
      else if (weatherMain.includes("clear") && list[0].dt_txt.includes("18:00")) setBgClass("bg-sunset");
      else if (weatherMain.includes("clear")) setBgClass("bg-clear");
      else setBgClass("bg-night");

      // Prepare graph data for next 7 forecasts
      const tempGraph = list.slice(0, 7).map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        value: item.main.temp
      }));

      const humidityGraph = list.slice(0, 7).map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        value: item.main.humidity
      }));

      const rainGraph = list.slice(0, 7).map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        value: item.rain?.["3h"] ?? 0
      }));

      setTempData(tempGraph);
      setHumidityData(humidityGraph);
      setRainData(rainGraph);
    } catch (err) {
      console.error(err);
      setError("City not found or network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`weather-graphs-page ${bgClass}`}>
      <h2>📈 Weather Graphs</h2>

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
      {loading && <p>Loading data...</p>}

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
  );
}

export default WeatherGraphsPage;