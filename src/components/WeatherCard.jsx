import React from "react";
import "../styles/WeatherCard.css";

function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <h2>
        {weather.name}, {weather.sys.country}
      </h2>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p className="temp">🌡️ {weather.main.temp}°C</p>
      <p>{weather.weather[0].description}</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>💨 Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherCard;