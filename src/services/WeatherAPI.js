// src/api/weatherAPI.js

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "22c33f3b11fe3fe3f2588df94e90f2e3"; 

/**
 * Fetch current weather data for a city
 * @param {string} city - City name to fetch weather for
 * @returns {Promise<Object>} Weather data object
 */
export async function getCurrentWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "City not found");
    }
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

/**
 * Fetch 5-day weather forecast data for a city
 * @param {string} city - City name to fetch forecast for
 * @returns {Promise<Array>} List of daily forecast entries
 */
export async function getForecast(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (response.ok) {
      // pick one entry per day (every 8th reading)
      return data.list.filter((_, index) => index % 8 === 0);
    } else {
      throw new Error(data.message || "City not found");
    }
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

/**
 * Fetch weather by geographic coordinates (latitude and longitude)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data object
 */
export async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Location not found");
    }
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
}