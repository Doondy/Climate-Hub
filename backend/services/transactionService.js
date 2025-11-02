import axios from "axios";
const API_URL = "http://localhost:5000/api/transactions";

export const saveTransaction = (data) => axios.post(API_URL, data);
export const getTransactions = () => axios.get(API_URL);
export const updateTransaction = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTransaction = (id) => axios.delete(`${API_URL}/${id}`);