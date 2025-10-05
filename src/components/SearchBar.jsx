import React from "react";
import "../styles/SearchBar.css";

function SearchBar({ city, setCity, onSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;