import axios from "./axios";
const API_BASE = "https://localhost:7219/api";
export const getFirstAidByDescription = (description: string) => {
  return axios.post(`${API_BASE}/FirstAid/suggest`, JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
