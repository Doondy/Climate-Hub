// ✅ Vite Environment Variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Get Authorization Header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ✅ Universal Fetch Handler
const fetchAPI = async (url, options = {}) => {
  try {
    const headers = getAuthHeaders();

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || JSON.stringify(errorData);
      } catch {
        // ignore JSON parse issues
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("⚠️ Cannot connect to backend. Ensure server is running.");
    }
    throw error;
  }
};

//
// ✅ Memory API
//
export const memoryAPI = {
  getAll: () => fetchAPI("/memories"),
  create: (data) =>
    fetchAPI("/memories", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/memories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/memories/${id}`, { method: "DELETE" }),
  search: (q) => fetchAPI(`/memories?search=${encodeURIComponent(q)}`),
};

//
// ✅ Weather Absence API
//
export const weatherAbsenceAPI = {
  getAll: () => fetchAPI("/weather/absence"),
  getMine: () => fetchAPI("/weather/absence/me"),
  create: (data) =>
    fetchAPI("/weather/absence", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/weather/absence/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => fetchAPI(`/weather/absence/${id}`, { method: "DELETE" }),
  search: (q) =>
    fetchAPI(`/weather/absence/me?search=${encodeURIComponent(q)}`),
};

//
// ✅ Work Report API
//
export const workReportAPI = {
  getAll: () => fetchAPI("/weather/reports"),
  create: (data) =>
    fetchAPI("/weather/reports", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/weather/reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => fetchAPI(`/weather/reports/${id}`, { method: "DELETE" }),
  search: (q) => fetchAPI(`/weather/reports?search=${encodeURIComponent(q)}`),
};

//
// ✅ User API
//
export const userAPI = {
  getCurrent: () => fetchAPI("/auth/me"),
};