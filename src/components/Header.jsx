import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <h1 className="logo">🌍 Climate Hub</h1>
      <nav>
        <a href="/weather">Dashboard</a>
        <a href="/forecast">Forecast</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
}

export default Header;