import React, { useState, useEffect } from "react";
import "../../styles/EmployeeSettings.css";

function EmployeeSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  // Apply theme dynamically
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`settings-container ${darkMode ? "dark" : "light"}`}>
      <h2>⚙️ Account Settings</h2>
      <p className="subtitle">Manage your preferences and privacy settings.</p>

      <div className="settings-section">
        <div className="setting-item">
          <label>🌙 Dark Mode</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <label>🔔 Email Notifications</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <label>🔑 Change Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="save-btn" onClick={handleSave}>
          💾 Save Changes
        </button>

        {saved && <p className="success-msg">✅ Settings saved successfully!</p>}
      </div>
    </div>
  );
}

export default EmployeeSettings;