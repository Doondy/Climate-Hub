import React, { useState } from "react";
import "../../styles/MemoriesPage.css";

function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    photos: [],
  });
  const [hovering, setHovering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setHovering(false);
    const files = Array.from(e.dataTransfer.files);
    setFormData({ ...formData, photos: files });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setHovering(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setHovering(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    const newMemory = {
      id: Date.now(),
      ...formData,
      date: new Date(formData.date).toLocaleDateString(),
    };

    setMemories([...memories, newMemory]);

    // Reset form
    setFormData({
      title: "",
      date: "",
      location: "",
      description: "",
      photos: [],
    });

    alert("Memory created successfully!");
  };

  return (
    <div className="memories-page">
      <div className="memories-container">
        {/* Left Column - Add Memory Form */}
        <div className="memories-form-section">
          <div className="section-header">
            <span className="camera-icon">📷</span>
            <h2>Add Memory</h2>
          </div>

          <form onSubmit={handleSubmit} className="memory-form">
            <div className="form-group">
              <label htmlFor="title">
                Memory Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Amazing sunset in Paris"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Date <span className="required">*</span>
              </label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  id="date"
                  name="date"
                  placeholder="dd-mm-yyyy"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Eiffel Tower, Paris"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Share your travel story and memories..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Photos</label>
              <div
                className={`upload-area ${hovering ? "dragging" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="upload-content">
                  <div className="upload-icon">⬆️</div>
                  <p>
                    {formData.photos.length > 0
                      ? `${formData.photos.length} file(s) selected`
                      : "Click to upload photos or drag and drop"}
                  </p>
                  <span className="upload-hint">
                    PNG, JPG up to 10MB each
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
            </div>

            <button type="submit" className="create-memory-btn">
              <span className="camera-icon">📷</span>
              Create Memory
            </button>
          </form>
        </div>

        {/* Right Column - Your Memories */}
        <div className="memories-display-section">
          <div className="section-header">
            <span className="camera-icon">📷</span>
            <h2>Your Memories</h2>
          </div>

          {memories.length === 0 ? (
            <div className="empty-memories">
              <div className="empty-heart-icon">💜</div>
              <p>No memories yet. Create your first travel memory!</p>
            </div>
          ) : (
            <div className="memories-grid">
              {memories.map((memory) => (
                <div key={memory.id} className="memory-card">
                  <div className="memory-card-header">
                    <h3>{memory.title}</h3>
                    <span className="memory-date">{memory.date}</span>
                  </div>
                  {memory.location && (
                    <div className="memory-location">
                      <span className="location-icon">📍</span>
                      {memory.location}
                    </div>
                  )}
                  <p className="memory-description">{memory.description}</p>
                  {memory.photos.length > 0 && (
                    <div className="memory-photos">
                      <span className="photo-count">
                        {memory.photos.length} photo(s)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoriesPage;


