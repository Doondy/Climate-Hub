import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../styles/EmployeeDashboard.css"; 

function EmployeeDashboard() {
  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>

      {/* Navigation Tabs */}
      <nav className="employee-nav">
        <Link to="/employee/profile">Profile</Link>
        <Link to="/employee/tasks">Tasks</Link>
        <Link to="/employee/reports">Reports</Link>
        <Link to="/employee/settings">Settings</Link>
      </nav>

      {/* Content area for nested routes */}
      <div className="employee-content">
        <Outlet />
      </div>
    </div>
  );
}

export default EmployeeDashboard;
