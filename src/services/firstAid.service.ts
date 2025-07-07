import axios from "./axios";
const API_BASE = "https://localhost:7219/api";

export const getAIFirstAidGuide = async (description: string): Promise<string> => {
  const res = await axios.post(`${API_BASE}/FirstAid/guides`, description, {
    headers: { "Content-Type": "application/json" },
  });
  // אם חוזר אובייקט עם aiInstructions, נחזיר רק את הטקסט
  if (typeof res.data === "object" && res.data !== null && res.data.aiInstructions) {
    return res.data.aiInstructions;
  }
  // אחרת נחזיר את התוצאה כמו שהיא (אם זה מחרוזת)
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
};

export const getFirstAidByDescription = (description: string) => {
  return axios.post(`${API_BASE}/FirstAid/guides`, JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// פונקציה להחזרת קואורדינטות כמחרוזת בלבד
export const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};
