import React, { useState } from "react";
import "../../styles/AlertPage.css";

const AlertPage = () => {
  const allAlerts = [
    { id: 1, title: "Heavy Rainfall Warning", level: "Severe", region: "Mumbai", date: "13 Oct 2025" },
    { id: 2, title: "High UV Index", level: "Moderate", region: "Chennai", date: "13 Oct 2025" },
    { id: 3, title: "Heatwave Alert", level: "High", region: "Delhi", date: "13 Oct 2025" },
    { id: 4, title: "Thunderstorm Alert", level: "High", region: "Coimbatore", date: "13 Oct 2025" },
  ];

  const [alerts, setAlerts] = useState(allAlerts);
  const [region, setRegion] = useState("");
  const [level, setLevel] = useState("");
  const [showSMSForm, setShowSMSForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [smsData, setSmsData] = useState({
    phone: "",
    message: "",
    alertType: "",
  });
  const [subscriptionData, setSubscriptionData] = useState({
    phone: "",
    name: "",
    alertTypes: [],
    regions: [],
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  const handleFilter = (e) => {
    e.preventDefault();
    const filtered = allAlerts.filter((alert) => {
      const regionMatch = region ? alert.region.toLowerCase().includes(region.toLowerCase()) : true;
      const levelMatch = level ? alert.level.toLowerCase() === level.toLowerCase() : true;
      return regionMatch && levelMatch;
    });
    setAlerts(filtered);
  };

  const handleReset = () => {
    setAlerts(allAlerts);
    setRegion("");
    setLevel("");
  };

  const handleSMSSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError("");

    try {
      // First check if server is running
      const healthCheck = await fetch("http://localhost:5000/health").catch(() => null);
      if (!healthCheck || !healthCheck.ok) {
        setError("⚠️ Backend server is not running. Please start it with: cd routes && node server.js");
        setSending(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(smsData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSmsData({ phone: "", message: "", alertType: "" });
        setTimeout(() => {
          setSuccess(false);
          setShowSMSForm(false);
        }, 3000);
      } else {
        setError(data.message || "Failed to send SMS");
      }
    } catch (err) {
      setError("❌ Cannot connect to backend server. Make sure the server is running on port 5000.");
      console.error("SMS Error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSmsData({ ...smsData, [name]: value });
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    setSubscribeSuccess(false);
    setSubscribeError("");

    try {
      // First check if server is running
      const healthCheck = await fetch("http://localhost:5000/health").catch(() => null);
      if (!healthCheck || !healthCheck.ok) {
        setSubscribeError("⚠️ Backend server is not running. Please start it first.");
        setSubscribing(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/sms/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeSuccess(true);
        setSubscriptionData({ phone: "", name: "", alertTypes: [], regions: [] });
        setTimeout(() => {
          setSubscribeSuccess(false);
          setShowSubscriptionForm(false);
        }, 3000);
      } else {
        setSubscribeError(data.message || "Failed to subscribe");
      }
    } catch (err) {
      setSubscribeError("❌ Cannot connect to backend server. Make sure the server is running on port 5000.");
      console.error("Subscription Error:", err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleSubscriptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentArray = subscriptionData[name];
      if (checked) {
        setSubscriptionData({
          ...subscriptionData,
          [name]: [...currentArray, value]
        });
      } else {
        setSubscriptionData({
          ...subscriptionData,
          [name]: currentArray.filter(item => item !== value)
        });
      }
    } else {
      setSubscriptionData({ ...subscriptionData, [name]: value });
    }
  };

  return (
    <div className="alert-page">
      <div className="alert-header">
        <h1>
          <span className="alert-icon">⚠️</span>
          Weather Alerts
        </h1>
        <p>Stay informed about severe weather conditions</p>
      </div>

      {/* Auto-Subscribe Section */}
      <div className="sms-alert-section">
        <button
          className="sms-toggle-btn"
          onClick={() => setShowSubscriptionForm(!showSubscriptionForm)}
        >
          <span className="sms-icon">🔔</span>
          {showSubscriptionForm ? "Hide" : "Subscribe to Auto-Alerts"}
        </button>

        {showSubscriptionForm && (
          <div className="sms-form-container">
            {subscribeSuccess && (
              <div className="success-message">
                <span>✅</span>
                Successfully subscribed! You'll now receive automatic weather alerts.
              </div>
            )}
            {subscribeError && (
              <div className="error-message">
                <span>❌</span>
                {subscribeError}
              </div>
            )}

            <form className="sms-form" onSubmit={handleSubscriptionSubmit}>
              <div className="form-group">
                <label htmlFor="subPhone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="subPhone"
                  name="phone"
                  placeholder="+1234567890"
                  value={subscriptionData.phone}
                  onChange={handleSubscriptionChange}
                  required
                />
                <small>Include country code (e.g., +1 for US)</small>
              </div>

              <div className="form-group">
                <label htmlFor="subName">Name (Optional)</label>
                <input
                  type="text"
                  id="subName"
                  name="name"
                  placeholder="Your name"
                  value={subscriptionData.name}
                  onChange={handleSubscriptionChange}
                />
              </div>

              <div className="form-group">
                <label>Alert Types</label>
                <div className="checkbox-group">
                  {['Severe Weather', 'Heatwave', 'Thunderstorm', 'Flood Warning', 'High UV Index'].map(type => (
                    <label key={type} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="alertTypes"
                        value={type}
                        checked={subscriptionData.alertTypes.includes(type)}
                        onChange={handleSubscriptionChange}
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <small>Select specific alerts or leave blank to receive all</small>
              </div>

              <div className="form-group">
                <label>Regions</label>
                <div className="checkbox-group">
                  {['Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Kolkata', 'Coimbatore'].map(region => (
                    <label key={region} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="regions"
                        value={region}
                        checked={subscriptionData.regions.includes(region)}
                        onChange={handleSubscriptionChange}
                      />
                      {region}
                    </label>
                  ))}
                </div>
                <small>Select specific regions or leave blank to receive all</small>
              </div>

              <button type="submit" className="send-sms-btn" disabled={subscribing}>
                {subscribing ? (
                  <>
                    <span className="spinner"></span>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <span className="sms-icon">🔔</span>
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SMS Alert Section */}
      <div className="sms-alert-section">
        <button
          className="sms-toggle-btn"
          onClick={() => setShowSMSForm(!showSMSForm)}
        >
          <span className="sms-icon">📱</span>
          {showSMSForm ? "Hide" : "Send SMS Alert"}
        </button>

        {showSMSForm && (
          <div className="sms-form-container">
            {success && (
              <div className="success-message">
                <span>✅</span>
                SMS sent successfully!
              </div>
            )}
            {error && (
              <div className="error-message">
                <span>❌</span>
                {error}
              </div>
            )}

            <form className="sms-form" onSubmit={handleSMSSubmit}>
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1234567890"
                  value={smsData.phone}
                  onChange={handleInputChange}
                  required
                />
                <small>Include country code (e.g., +1 for US)</small>
              </div>

              <div className="form-group">
                <label htmlFor="alertType">Alert Type</label>
                <select
                  id="alertType"
                  name="alertType"
                  value={smsData.alertType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Alert Type</option>
                  <option value="Severe Weather">Severe Weather</option>
                  <option value="Heatwave">Heatwave</option>
                  <option value="Thunderstorm">Thunderstorm</option>
                  <option value="Flood Warning">Flood Warning</option>
                  <option value="High UV Index">High UV Index</option>
                  <option value="Custom">Custom Message</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Enter your alert message..."
                  value={smsData.message}
                  onChange={handleInputChange}
                  required
                />
                <small>{smsData.message.length}/160 characters</small>
              </div>

              <button type="submit" className="send-sms-btn" disabled={sending}>
                {sending ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="sms-icon">📤</span>
                    Send SMS
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Filter Alerts Section */}
      <div className="filter-section">
        <h2>🌍 Weather Alert Filter</h2>
        <form className="alert-form" onSubmit={handleFilter}>
          <div className="filter-group">
            <input
              type="text"
              placeholder="Filter by region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="filter-select"
            >
              <option value="">All Levels</option>
              <option value="Severe">Severe</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="filter-buttons">
            <button type="submit" className="filter-btn">
              🔍 Filter
            </button>
            <button type="button" onClick={handleReset} className="reset-btn">
              🔄 Reset
            </button>
          </div>
        </form>
      </div>

      {/* Alerts Display */}
      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${alert.level.toLowerCase()}`}>
              <div className="alert-card-header">
                <h3>{alert.title}</h3>
                <span className={`alert-badge ${alert.level.toLowerCase()}`}>
                  {alert.level}
                </span>
              </div>
              <div className="alert-card-body">
                <p>
                  <strong>🌍 Region:</strong> {alert.region}
                </p>
                <p>
                  <strong>📅 Date:</strong> {alert.date}
                </p>
              </div>
              <button
                className="alert-send-btn"
                onClick={() => {
                  setShowSMSForm(true);
                  setSmsData({
                    ...smsData,
                    message: `${alert.title} - ${alert.region}: ${alert.level} level alert on ${alert.date}`,
                  });
                }}
              >
                📱 Send Alert
              </button>
            </div>
          ))
        ) : (
          <div className="no-alerts">
            <p>🔍 No alerts found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPage;
