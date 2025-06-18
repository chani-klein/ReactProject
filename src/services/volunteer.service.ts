import axios from "axios";

const API_BASE = "https://localhost:7219/api";

// רישום מתנדב חדש
export const registerVolunteer = (volunteer: any) => {
  return axios.post(`${API_BASE}/Volunteer`, volunteer);
};

// שליפת כל המתנדבים
export const getVolunteers = () => {
  return axios.get(`${API_BASE}/Volunteer`);
};

// שליפת מתנדב לפי ID
export const getVolunteerById = (id: number) => {
  return axios.get(`${API_BASE}/Volunteer/${id}`);
};

// עדכון מתנדב
export const updateVolunteer = (id: number, updatedData: any) => {
  return axios.put(`${API_BASE}/Volunteer/${id}`, updatedData);
};

// מחיקת מתנדב
export const deleteVolunteer = (id: number) => {
  return axios.delete(`${API_BASE}/Volunteer/${id}`);
};

// שליפת קריאות קרובות (לפי מתנדב, כנראה לפי המיקום שלו)
export const GetNearby = (locationX: number, locationY: number) => 
   axios.get("https://localhost:7219/api/Volunteer/nearby", {
    params: { locationX, locationY },
  });



