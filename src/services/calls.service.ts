import axios from "axios";
const API_BASE = "https://localhost:7219/api";
// 🟢 התחברות או הרשמה (אזרח)
export const registerCitizen = (user: any) => axios.post(`${API_BASE}/User`, user);
export const loginCitizen = (credentials: any) => axios.post(`${API_BASE}/login`, credentials);

// 🟡 פתיחת קריאה
export const createCall = (formData: FormData) =>
  axios.post(`${API_BASE}/Calls`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const assignNearbyVolunteers = (callId: number) =>
  axios.post(`${API_BASE}/Calls/${callId}/assign-nearby`);

// 📋 סיום קריאה
export const completeCall = (callId: number, formData: any) =>
  axios.put(`${API_BASE}/Calls/${callId}/complete`, formData);

// 🧾 מידע על קריאה
export const getCallStatus = (callId: number) =>
  axios.get(`${API_BASE}/Calls/status/${callId}`);

export const getCallById = (callId: number) => axios.get(`${API_BASE}/Calls/${callId}`);
export const getAllCalls = () => axios.get(`${API_BASE}/Calls`);

// 🧠 עזרה ראשונה
export const getFirstAidSuggestions = (description: string) =>
  axios.post(`${API_BASE}/FirstAid/suggest`, JSON.stringify(description), {
    headers: { "Content-Type": "application/json" },
  });

export const getAllFirstAidGuides = () => axios.get(`${API_BASE}/FirstAid/all`);
