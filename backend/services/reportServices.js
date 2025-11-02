import axios from "axios";
const API_URL = "http://localhost:5000/api/reports";

export const saveReport = (data) => axios.post(API_URL, data);
export const getReports = () => axios.get(API_URL);
export const updateReport = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteReport = (id) => axios.delete(`${API_URL}/${id}`);
