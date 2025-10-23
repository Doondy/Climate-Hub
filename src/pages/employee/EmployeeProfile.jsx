import React, { useState } from "react";
import "../../styles/EmployeeProfile.css"; 

function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    employeeId: "EMP1024",
    department: "Software Development",
    email: "john.doe@company.com",
    phone: "+91 98765 43210",
    location: "Hyderabad, India",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="employee-profile">
      <h2>👤 Employee Profile</h2>

      <div className="profile-card">
        <div className="profile-photo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile"
          />
          <button className="upload-btn">Change Photo</button>
        </div>

        <div className="profile-details">
          {Object.keys(profile).map((key) => (
            <div key={key} className="profile-row">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={profile[key]}
                  onChange={handleChange}
                />
              ) : (
                <span>{profile[key]}</span>
              )}
            </div>
          ))}

          <div className="profile-actions">
            {isEditing ? (
              <button className="save-btn" onClick={handleSave}>
                💾 Save
              </button>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;