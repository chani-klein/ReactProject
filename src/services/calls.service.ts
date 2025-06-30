import axios from "axios";

const API_BASE = "https://localhost:7219/api";

// פונקציה ליצירת Axios עם Authorization Header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 🟢 התחברות או הרשמה (אזרח)
export const registerCitizen = (user: any) =>
  axios.post(`${API_BASE}/User`, user);

export const loginCitizen = (credentials: any) =>
  axios.post(`${API_BASE}/login`, credentials);

// 🟡 פתיחת קריאה
export const createCall = (formData: FormData) =>
  axios.post(`${API_BASE}/Calls`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders(),
    },
  });

export const assignNearbyVolunteers = (callId: number) =>
  axios.post(`${API_BASE}/Calls/${callId}/assign-nearby`, null, {
    headers: getAuthHeaders(),
  });

// 📋 סיום קריאה
export const completeCall = (callId: number, formData: any) =>
  axios.put(`${API_BASE}/Calls/${callId}/complete`, formData, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

// 🧾 מידע על קריאה
export const getCallStatus = (callId: number) =>
  axios.get(`${API_BASE}/Calls/status/${callId}`, {
    headers: getAuthHeaders(),
  });

export const getCallById = (callId: number) =>
  axios.get(`${API_BASE}/Calls/${callId}`, {
    headers: getAuthHeaders(),
  });

export const getAllCalls = () =>
  axios.get(`${API_BASE}/Calls`, {
    headers: getAuthHeaders(),
  });

// 🧠 עזרה ראשונה
export const getFirstAidSuggestions = (description: string) =>
  axios.post(`${API_BASE}/FirstAid/suggest`, JSON.stringify(description), {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

export const getAllFirstAidGuides = () =>
  axios.get(`${API_BASE}/FirstAid/all`, {
    headers: getAuthHeaders(),
  });
  export const getMyCalls = () =>
  axios.get(`${API_BASE}/Calls/by-user`, {
    headers: getAuthHeaders(),
  });
