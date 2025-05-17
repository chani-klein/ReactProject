import axios from "axios";

const API_BASE = "https://localhost:7219/api"; // כתובת השרת

export const registerVolunteer = (volunteer: any) => {
  return axios.post(`${API_BASE}/Volunteer`, volunteer);
};
