// API Service for connecting to backend
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Only add Authorization header if token exists and is valid
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic fetch helper
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - token might be invalid or expired
      if (response.status === 401) {
        const error = await response.json().catch(() => ({ message: 'Authentication required' }));
        // Clear invalid token
        localStorage.removeItem('token');
        throw new Error(error.message || 'Authentication required. Please log in again.');
      }
      
      const error = await response.json().catch(() => ({ error: 'API request failed' }));
      throw new Error(error.error || error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    // Provide better error messages for connection issues
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error('API Error: Unable to connect to server. Please ensure the backend server is running on http://localhost:5000');
      throw new Error('Unable to connect to server. Please ensure the backend server is running on http://localhost:5000');
    }
    console.error('API Error:', error);
    throw error;
  }
};

// Memory API
export const memoryAPI = {
  // Get all memories
  getAll: async () => {
    return fetchAPI('/memories');
  },

  // Create memory
  create: async (memoryData) => {
    return fetchAPI('/memories', {
      method: 'POST',
      body: JSON.stringify(memoryData)
    });
  },

  // Update memory
  update: async (id, memoryData) => {
    return fetchAPI(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memoryData)
    });
  },

  // Delete memory
  delete: async (id) => {
    return fetchAPI(`/memories/${id}`, {
      method: 'DELETE'
    });
  },

  // Search memories
  search: async (query) => {
    return fetchAPI(`/memories?search=${encodeURIComponent(query)}`);
  }
};

// Weather Absence API
export const weatherAbsenceAPI = {
  // Get all absence requests (admin)
  getAll: async () => {
    return fetchAPI('/weather/absence');
  },

  // Get user's own absence requests
  getMine: async () => {
    return fetchAPI('/weather/absence/me');
  },

  // Create absence request
  create: async (absenceData) => {
    return fetchAPI('/weather/absence', {
      method: 'POST',
      body: JSON.stringify(absenceData)
    });
  },

  // Update absence request (admin)
  update: async (id, updateData) => {
    return fetchAPI(`/weather/absence/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Delete absence request
  delete: async (id) => {
    return fetchAPI(`/weather/absence/${id}`, {
      method: 'DELETE'
    });
  },

  // Search absence requests
  search: async (query) => {
    return fetchAPI(`/weather/absence/me?search=${encodeURIComponent(query)}`);
  }
};

// Work Report API
export const workReportAPI = {
  // Get all work reports
  getAll: async () => {
    return fetchAPI('/weather/reports');
  },

  // Create work report
  create: async (reportData) => {
    return fetchAPI('/weather/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  // Update work report
  update: async (id, reportData) => {
    return fetchAPI(`/weather/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData)
    });
  },

  // Delete work report
  delete: async (id) => {
    return fetchAPI(`/weather/reports/${id}`, {
      method: 'DELETE'
    });
  },

  // Search work reports
  search: async (query) => {
    return fetchAPI(`/weather/reports?search=${encodeURIComponent(query)}`);
  }
};

// User API
export const userAPI = {
  // Get current user
  getCurrent: async () => {
    return fetchAPI('/auth/me');
  }
};
