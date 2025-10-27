import React, { useState, useEffect } from "react";
import "../../styles/EmployeeReports.css";

const API_BASE_URL = "http://localhost:5000";

function EmployeeReports() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalLogins: 0,
    successfulLogins: 0,
    failedLogins: 0,
    successRate: 0,
    lastLogin: "N/A",
  });
  const [dateFilter, setDateFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  // Fetch login history from API
  const fetchLoginHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view reports");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/login-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch login history");
      }

      const data = await response.json();
      
      // Filter by date range
      let filteredData = data;
      if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredData = data.filter(item => new Date(item.loginTime) >= weekAgo);
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filteredData = data.filter(item => new Date(item.loginTime) >= monthAgo);
      }

      setLoginHistory(filteredData);

      // Calculate statistics
      const total = filteredData.length;
      const successful = filteredData.filter(item => item.loginStatus === 'success').length;
      const failed = filteredData.filter(item => item.loginStatus === 'failed').length;
      const lastLogin = filteredData.length > 0 
        ? new Date(filteredData[0].loginTime).toLocaleString()
        : "N/A";

      setStats({
        totalLogins: total,
        successfulLogins: successful,
        failedLogins: failed,
        successRate: total > 0 ? ((successful / total) * 100).toFixed(1) : 0,
        lastLogin,
      });
    } catch (err) {
      console.error("Error fetching login history:", err);
      setError("Failed to load reports. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, [dateFilter]);

  const handleExport = () => {
    setExporting(true);
    
    const csvContent = [
      ["Date", "Status", "IP Address", "User Agent", "Failure Reason"].join(","),
      ...loginHistory.map(item => [
        new Date(item.loginTime).toLocaleString(),
        item.loginStatus,
        item.ipAddress || "N/A",
        item.userAgent || "N/A",
        item.failureReason || "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `login-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    setExporting(false);
  };

  const getStatusBadge = (status) => {
    return status === 'success' 
      ? <span className="badge badge-success">✓ Success</span>
      : <span className="badge badge-failed">✗ Failed</span>;
  };

  return (
    <div className="employee-reports">
      <div className="reports-header">
        <div>
          <h2>📊 Employee Reports & Analytics</h2>
          <p className="subtitle">Comprehensive login history and security analytics</p>
        </div>
        <div className="header-actions">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-filter"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button 
            onClick={handleExport} 
            className="export-btn"
            disabled={exporting || loginHistory.length === 0}
          >
            {exporting ? "Exporting..." : "📥 Export CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
          <button onClick={fetchLoginHistory} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e3f2fd" }}>
            🔐
          </div>
          <div className="stat-content">
            <h3>{stats.totalLogins}</h3>
            <p>Total Login Attempts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f5e9" }}>
            ✓
          </div>
          <div className="stat-content">
            <h3>{stats.successfulLogins}</h3>
            <p>Successful Logins</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff3e0" }}>
            ✗
          </div>
          <div className="stat-content">
            <h3>{stats.failedLogins}</h3>
            <p>Failed Attempts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e5f5" }}>
            📈
          </div>
          <div className="stat-content">
            <h3>{stats.successRate}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      {/* Login History Table */}
      <div className="history-section">
        <h3>Login History</h3>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : loginHistory.length === 0 ? (
          <div className="no-data">
            <p>No login history available</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>User Agent</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.loginTime).toLocaleString()}</td>
                    <td>{getStatusBadge(item.loginStatus)}</td>
                    <td>{item.ipAddress || "N/A"}</td>
                    <td className="user-agent">
                      {item.userAgent ? item.userAgent.substring(0, 50) + "..." : "N/A"}
                    </td>
                    <td>
                      {item.failureReason && (
                        <span className="failure-reason">{item.failureReason}</span>
                      )}
                      {!item.failureReason && item.loginStatus === 'success' && (
                        <span className="success-indicator">Authenticated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="info-section">
        <h4>📌 Security Information</h4>
        <ul>
          <li>Last login: <strong>{stats.lastLogin}</strong></li>
          <li>All login attempts are logged for security auditing</li>
          <li>Failed login attempts may indicate unauthorized access attempts</li>
          <li>Export your data anytime for compliance and record-keeping</li>
        </ul>
      </div>
    </div>
  );
}

export default EmployeeReports;