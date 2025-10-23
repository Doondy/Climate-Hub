const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/auth"); // JWT middleware
const History = require("../models/History");

// Load API key from .env
const apiKey = process.env.WEATHER_API_KEY;

// GET weather for a city and save to history
router.get("/:city", authMiddleware, async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const weatherData = response.data;

    // Save search to history
    const newHistory = new History({
      user: req.user.id,
      city,
      weatherData
    });
    await newHistory.save();

    res.json(weatherData);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching weather", error: err.message });
  }
});

module.exports = router;