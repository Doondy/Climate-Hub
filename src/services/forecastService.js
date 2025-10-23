import axios from "axios";
// Do not load dotenv in browser; access env vars injected at build time
// Backend endpoint for forecast


/**
 * Fetch 5-day weather forecast for a given city
 * @param {string} city - City name
 * @returns {object|null} - Forecast data from OpenWeatherMap
 */
export const getForecast = async (city) => {
  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY || process.env.REACT_APP_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error("OpenWeather API key not found in environment (REACT_APP_OPENWEATHER_API_KEY or OPENWEATHER_API_KEY)");
      return null;
    }
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    
    return response.data; // The full forecast data
  } catch (err) {
    console.error("Error fetching forecast:", err.message);
    return null;
  }
};