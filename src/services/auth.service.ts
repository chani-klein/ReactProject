import axios from "axios";

const API_BASE = "https://localhost:7219/api"; // כתובת ה-API שלך

export const registerUser = (user: any) => {
  return axios.post(`${API_BASE}/User`, user);
};
