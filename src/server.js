const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS so React frontend can access
app.use(cors());
app.use(express.json());

// Sample trip plans for weather conditions
const tripPlans = {
  sunny: [
    { name: "Beach Trip 🏖️", link: "https://www.booking.com/beach-holidays" },
    { name: "Mountain Trek 🏔️", link: "https://www.booking.com/mountain-trekking" },
    { name: "Picnic in the Park 🌳", link: "https://www.eventbrite.com/d/online/picnic/" },
  ],
  rainy: [
    { name: "Museum Visit 🖼️", link: "https://www.booking.com/museums" },
    { name: "Indoor Cafe ☕", link: "https://www.yelp.com/cafes" },
    { name: "Shopping Mall 🛍️", link: "https://www.tripadvisor.com/Shopping" },
  ],
  cold: [
    { name: "Hill Station Stay ❄️", link: "https://www.booking.com/hill-stations" },
    { name: "Hot Springs ♨️", link: "https://www.booking.com/hot-springs" },
    { name: "Scenic Drive 🚗", link: "https://www.tripadvisor.com/ScenicDrives" },
  ],
  windy: [
    { name: "Kite Festival 🪁", link: "https://www.eventbrite.com/d/online/kite-festival/" },
    { name: "Cliff Walk 🌬️", link: "https://www.tripadvisor.com/CliffWalks" },
    { name: "Lakeside Stroll 🌊", link: "https://www.tripadvisor.com/Lakes" },
  ],
};

// Endpoint to get trip plans based on weather
app.get("/api/trips/:weather", (req, res) => {
  const weather = req.params.weather.toLowerCase().trim();
  if (tripPlans[weather]) {
    res.json(tripPlans[weather]);
  } else {
    res.json([{ name: "Enter a valid weather condition!", link: "#" }]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});