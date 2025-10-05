import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import WeatherPage from "./pages/WeatherPage";
import ForecastPage from "./pages/ForecastPage";
import AboutPage from "./pages/About";
import TripPlanner from "./components/TripPlanner";

import WeatherGraphsPage from "./pages/WeatherGraphsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard after login */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Weather related pages */}
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/forecast" element={<ForecastPage />} />

        {/* Trip planning */}
        <Route path="/tripplanner" element={<TripPlanner />} />

        {/* Past weather graphs */}
        <Route path="/weathergraphs" element={<WeatherGraphsPage />} />

        {/* About Page */}
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;