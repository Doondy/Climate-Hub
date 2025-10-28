import React, { useState } from "react";
import "../../styles/AlertPage.css";

const AlertPage = () => {
  // 🌍 Example global alerts
  const allAlerts = [
    { id: 1, title: "Hurricane Warning", level: "Severe", region: "Florida, USA", date: "28 Oct 2025" },
    { id: 2, title: "Heatwave Alert", level: "High", region: "Delhi, India", date: "28 Oct 2025" },
    { id: 3, title: "Blizzard Warning", level: "Severe", region: "Toronto, Canada", date: "28 Oct 2025" },
    { id: 4, title: "Flood Warning", level: "Moderate", region: "Jakarta, Indonesia", date: "28 Oct 2025" },
    { id: 5, title: "Wildfire Alert", level: "High", region: "Sydney, Australia", date: "28 Oct 2025" },
    { id: 6, title: "Dust Storm Warning", level: "Moderate", region: "Riyadh, Saudi Arabia", date: "28 Oct 2025" },
    { id: 7, title: "Tornado Watch", level: "Severe", region: "Texas, USA", date: "28 Oct 2025" },
    { id: 8, title: "Heavy Rainfall", level: "High", region: "London, UK", date: "28 Oct 2025" },
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

  // 🌍 Filter by region/level
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

  // 📤 Send SMS
  const handleSMSSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError("");

    try {
      const healthCheck = await fetch("http://localhost:5000/health").catch(() => null);
      if (!healthCheck || !healthCheck.ok) {
        setError("⚠️ Backend server not running. Please start it with: cd routes && node server.js");
        setSending(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setError("❌ Cannot connect to backend server. Ensure it's running on port 5000.");
      console.error("SMS Error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSmsData({ ...smsData, [name]: value });
  };

  // 🔔 Subscription form
  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    setSubscribeSuccess(false);
    setSubscribeError("");

    try {
      const healthCheck = await fetch("http://localhost:5000/health").catch(() => null);
      if (!healthCheck || !healthCheck.ok) {
        setSubscribeError("⚠️ Backend server is not running. Please start it first.");
        setSubscribing(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/sms/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setSubscribeError("❌ Cannot connect to backend server. Ensure it's running on port 5000.");
      console.error("Subscription Error:", err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleSubscriptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const currentArray = subscriptionData[name];
      setSubscriptionData({
        ...subscriptionData,
        [name]: checked
          ? [...currentArray, value]
          : currentArray.filter((item) => item !== value),
      });
    } else {
      setSubscriptionData({ ...subscriptionData, [name]: value });
    }
  };

  return (
    <div className="alert-page">
      <div className="alert-header">
        <h1><span className="alert-icon">🌐</span> Global Weather Alerts</h1>
        <p>Stay informed about severe weather events anywhere in the world</p>
      </div>

      {/* 🌍 Subscription Form */}
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
              <div className="success-message">✅ Subscribed successfully! You’ll now receive global alerts.</div>
            )}
            {subscribeError && <div className="error-message">❌ {subscribeError}</div>}

            <form className="sms-form" onSubmit={handleSubscriptionSubmit}>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+14155552671"
                  value={subscriptionData.phone}
                  onChange={handleSubscriptionChange}
                  required
                />
                <small>Include country code (e.g., +1 for USA, +91 for India)</small>
              </div>

              <div className="form-group">
                <label>Name (Optional)</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={subscriptionData.name}
                  onChange={handleSubscriptionChange}
                />
              </div>

              <div className="form-group">
                <label>Alert Types</label>
                <div className="checkbox-group">
                  {["Hurricane", "Flood", "Blizzard", "Heatwave", "Thunderstorm", "Wildfire", "Tornado"].map(
                    (type) => (
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
                    )
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Regions</label>
                <div className="checkbox-group">
                  {["USA", "India", "Canada", "UK", "Australia", "Indonesia", "Saudi Arabia"].map(
                    (region) => (
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
                    )
                  )}
                </div>
              </div>

              <button type="submit" className="send-sms-btn" disabled={subscribing}>
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 📱 Manual SMS Form */}
      <div className="sms-alert-section">
        <button className="sms-toggle-btn" onClick={() => setShowSMSForm(!showSMSForm)}>
          <span className="sms-icon">📱</span> {showSMSForm ? "Hide" : "Send SMS Alert"}
        </button>

        {showSMSForm && (
          <div className="sms-form-container">
            {success && <div className="success-message">✅ SMS sent successfully!</div>}
            {error && <div className="error-message">❌ {error}</div>}

            <form className="sms-form" onSubmit={handleSMSSubmit}>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+447911123456"
                  value={smsData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Alert Type</label>
                <select name="alertType" value={smsData.alertType} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Hurricane">Hurricane</option>
                  <option value="Flood">Flood</option>
                  <option value="Blizzard">Blizzard</option>
                  <option value="Wildfire">Wildfire</option>
                  <option value="Heatwave">Heatwave</option>
                  <option value="Thunderstorm">Thunderstorm</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Enter your alert message..."
                  value={smsData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="send-sms-btn" disabled={sending}>
                {sending ? "Sending..." : "Send SMS"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 🔍 Filter Section */}
      <div className="filter-section">
        <h2>🌎 Filter Global Alerts</h2>
        <form className="alert-form" onSubmit={handleFilter}>
          <input
            type="text"
            placeholder="Search by region or country"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="filter-input"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="filter-select"
          >
            <option value="">All Levels</option>
            <option value="Severe">Severe</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
          </select>
          <div className="filter-buttons">
            <button type="submit" className="filter-btn">🔍 Filter</button>
            <button type="button" onClick={handleReset} className="reset-btn">🔄 Reset</button>
          </div>
        </form>
      </div>

      {/* 🌐 Display Alerts */}
      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${alert.level.toLowerCase()}`}>
              <div className="alert-card-header">
                <h3>{alert.title}</h3>
                <span className={`alert-badge ${alert.level.toLowerCase()}`}>{alert.level}</span>
              </div>
              <div className="alert-card-body">
                <p><strong>🌍 Region:</strong> {alert.region}</p>
                <p><strong>📅 Date:</strong> {alert.date}</p>
              </div>
              <button
                className="alert-send-btn"
                onClick={() => {
                  setShowSMSForm(true);
                  setSmsData({
                    ...smsData,
                    message: `${alert.title} in ${alert.region} — ${alert.level} alert on ${alert.date}`,
                  });
                }}
              >
                📤 Send SMS
              </button>
            </div>
          ))
        ) : (
          <div className="no-alerts">🔍 No alerts found for selected filters.</div>
        )}
      </div>
    </div>
  );
};

export default AlertPage;