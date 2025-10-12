import React, { useState } from "react"; // ✅ Import React and hooks together
import WeatherChart from "../components/WeatherChart"; 
import axios from "axios";               // ✅ Correct spelling
import "../styles/WeatherGraphsPage.css"; // ✅ Correct file name
function WeatherGraphsPage() {
  const tempData = [
    { date: "Mon", value: 29 },
    { date: "Tue", value: 30 },
    { date: "Wed", value: 27 },
    { date: "Thu", value: 28 },
    { date: "Fri", value: 31 },
  ];

  const rainData = [
    { date: "Mon", value: 2 },
    { date: "Tue", value: 0 },
    { date: "Wed", value: 5 },
    { date: "Thu", value: 1 },
    { date: "Fri", value: 3 },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h2>📈 Past Weather Trends</h2>
      <WeatherChart data={tempData} title="Temperature (°C) over Last 7 Days" />
      <WeatherChart data={rainData} title="Rainfall (mm) over Last 7 Days" />
    </div>
  );
}

export default WeatherGraphsPage;