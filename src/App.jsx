import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

// ✅ Dashboards
import CompanyDashboard from "./components/CompanyDashboard.jsx";
import EmployeeDashboard from "./components/EmployeeDashboard.jsx";
import TravellerDashboard from "./pages/Traveller/TravellerDashboard.jsx";

// ✅ Company & Employee Components
import CompanyNotifications from "./components/CompanyNotifications.jsx";
import WorkHistory from "./components/WorkHistory.jsx";
import WorkReportTable from "./components/WorkReportTable.jsx";
import WorkStatusForm from "./components/WorkStatusForm.jsx";

// ✅ Wellness Components
import AbsenceRequest from "./components/WellnessComponents/AbsenceRequest.jsx";
import WeatherAbsenceForm from "./components/WeatherAbsenceForm.jsx";

// ✅ Traveller Pages
import AboutPage from "./pages/Traveller/AboutPage.jsx";
import AlertPage from "./pages/Traveller/AlertPage.jsx";
import ForecastPage from "./pages/Traveller/ForecastPage.jsx";
import MemoriesPage from "./pages/Traveller/MemoriesPage.jsx";
import TripPlanner from "./pages/Traveller/TripPlanner.jsx";
import WeatherGraphsPage from "./pages/Traveller/WeatherGraphsPage.jsx";
import WeatherPage from "./pages/Traveller/WeatherPage.jsx";

// ✅ Auth Provider
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ✅ Company Routes */}
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/company-notifications" element={<CompanyNotifications />} />

          {/* ✅ Employee Routes */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/work-history" element={<WorkHistory />} />
          <Route path="/work-report" element={<WorkReportTable />} />
          <Route path="/work-status" element={<WorkStatusForm />} />

          {/* ✅ Wellness Routes */}
          <Route path="/wellness/absence-request" element={<AbsenceRequest />} />
          <Route path="/wellness/absence-form" element={<WeatherAbsenceForm />} />
          <Route path="/wellness" element={<AbsenceRequest />} />

          

          {/* ✅ Traveller Routes */}
          <Route path="/traveller-dashboard" element={<TravellerDashboard />} />
          <Route path="/traveller/about" element={<AboutPage />} />
          <Route path="/traveller/alerts" element={<AlertPage />} />
          <Route path="/traveller/forecast" element={<ForecastPage />} />
          <Route path="/traveller/memories" element={<MemoriesPage />} />

          {/* ✅ Matching paths fixed */}
          <Route path="/traveller/tripplanner" element={<TripPlanner />} />
          <Route path="/traveller/weather-graphs" element={<WeatherGraphsPage />} />
          <Route path="/traveller/weather" element={<WeatherPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;