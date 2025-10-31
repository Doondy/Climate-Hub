import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL;

export const getForecast = async (city) => {
  try {
    // Add console.log for debugging
    console.log("API Key:", "22c33f3b11fe3fe3f2588df94e90f2e3");
    console.log("Base URL:", BASE_URL);

    if (!API_KEY) {
      throw new Error("Weather API key not configured");
    }

    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching forecast:", error.message);
    throw error; // Let the component handle the error
  }
};