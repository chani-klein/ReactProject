import axios from "axios";

const API_BASE = "https://localhost:7219/api";

export const createCall = (formData: FormData) => {
  return axios.post("https://localhost:7219/api/Calls", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ✅ חדש: בקשה להוראות לפי תיאור
export const getFirstAidSuggestions = (description: string) => {
  return axios.post(`${API_BASE}/FirstAid/suggest`, JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getFirstAidInstructions = (description: string) => {
  return axios.post(`${API_BASE}/FirstAid/suggest`, JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
