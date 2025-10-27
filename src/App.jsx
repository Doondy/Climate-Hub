import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

// Employee
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import EmployeeReports from "./pages/employee/EmployeeReports";
import EmployeeSettings from "./pages/employee/EmployeeSettings";

// Traveller
import TravellerDashboard from "./pages/Traveller/TravellerDashboard";
import MemoriesPage from "./pages/Traveller/MemoriesPage";
import WeatherPage from "./pages/Traveller/WeatherPage";
import ForecastPage from "./pages/Traveller/ForecastPage";
import AboutPage from "./pages/Traveller/AboutPage";
import AlertPage from "./pages/Traveller/AlertPage";
import TripPlanner from "./pages/Traveller/TripPlanner";
import WeatherGraphsPage from "./pages/Traveller/WeatherGraphsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home and Login */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Employee Dashboard */}
        <Route path="/employee" element={<EmployeeDashboard />}>
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="reports" element={<EmployeeReports />} />
          <Route path="settings" element={<EmployeeSettings />} />
        </Route>

        {/* Traveller Dashboard */}
        <Route path="/traveller" element={<TravellerDashboard />}>
          <Route path="memories" element={<MemoriesPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="alert" element={<AlertPage />} />
          <Route path="tripplanner" element={<TripPlanner />} /> 
          <Route path="weathergraphs" element={<WeatherGraphsPage />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;