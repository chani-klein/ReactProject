import axios from "./axios";
const API_BASE = "https://localhost:7219/api";

export const getAIFirstAidGuide = async (description: string): Promise<string> => {
  const res = await axios.post(`${API_BASE}/FirstAid/ai`, description, {
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
  return axios.post(`${API_BASE}/FirstAid/ai`, JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// פונקציה להמרת קואורדינטות לכתובת אנושית (reverse geocoding)
export const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    // שימוש ב-API של Nominatim (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=he`;
    const res = await fetch(url);
    const data = await res.json();
    return data.display_name || "כתובת לא זמינה";
  } catch (e) {
    return "כתובת לא זמינה";
  }
};
