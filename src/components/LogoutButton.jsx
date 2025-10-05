import React from "react";
import "../styles/LogoutButton.css";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();
  return (
    <button className="logout-btn" onClick={() => navigate("/")}>
      Logout
    </button>
  );
}

export default LogoutButton;
