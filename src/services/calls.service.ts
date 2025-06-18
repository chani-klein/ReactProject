
import axios from "./axios";

// יצירת קריאה חדשה (כולל קובץ)
export const createCall = (formData: FormData) => {
  return axios.post("/Calls", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// שליחת תיאור לקריאה לקבלת הוראות עזרה ראשונה
export const getFirstAidSuggestions = (description: string) => {
  return axios.post("/FirstAid/suggest", JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// שליחת תיאור לקבלת הוראות (שמות חופפים לקוד אחר)
export const getFirstAidInstructions = getFirstAidSuggestions;

// שליפת קריאה מוקצת לפי מזהה מתנדב
export const getAssignedCalls = (volunteerId: number) => {
  return axios.get(`/Calls/assigned/${volunteerId}`);
};

// עדכון סטטוס קריאה ("בדרך", "לא זמין" וכו')
export const updateCallStatus = (id: number, status: string) => {
  return axios.put(`/Calls/${id}/status`, { status });
};

// שליפת סטטוס לפי מזהה קריאה
export const getCallStatus = (id: number) => {
  return axios.get(`/Calls/status/${id}`);
};
// // קריאות מוקצות למתנדב
// export const getAssignedCalls = (volunteerId: number) =>
//   axios.get(`${API_BASE}/Calls/assigned/${volunteerId}`);
