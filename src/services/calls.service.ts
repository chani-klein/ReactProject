import axios from "axios";

const API_BASE = "https://localhost:7219/api";

export const createCall = (formData: FormData) => {
  return axios.post("https://localhost:7219/api/Calls", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

