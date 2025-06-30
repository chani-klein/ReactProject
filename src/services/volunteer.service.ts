
import axios from './axios';
import type { AxiosResponse } from 'axios';
import type { Call } from '../types/call.types'; // התאם את הנתיב לממשק Call
const API_BASE = 'https://localhost:7219/api';

// 🟢 התחברות או הרשמה (מתנדב)
export const registerVolunteer = (volunteer: any) =>
  axios.post(`${API_BASE}/Volunteer`, volunteer);

export const loginVolunteer = (credentials: any) =>
  axios.post(`${API_BASE}/VolunteerLogin`, credentials);

// 🔔 שליחת התראות למתנדבים
export const getNearbyCalls = (volunteerId: number): Promise<AxiosResponse<Call[]>> =>
  axios.get(`${API_BASE}/Volunteer/nearby-alerts`, {
    params: { id: volunteerId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}` // טוקן JWT
    }
  }).catch((error) => {
    console.error('שגיאה באיתור קריאות:', error);
    throw error;
  });

// 📡 מידע על מתנדבים בקריאה
export const getCallVolunteersInfo = (callId: number) =>
  axios.get(`${API_BASE}/VolunteersCalls/${callId}/info`);

// 📋 היסטוריה וקריאות פעילות
export const getVolunteerHistory = (volunteerId: number) =>
  axios.get(`${API_BASE}/VolunteersCalls/history/${volunteerId}`);

export const getActiveCalls = (volunteerId: number) =>
  axios.get(`${API_BASE}/VolunteersCalls/active/${volunteerId}`);

// 🚑 תגובת מתנדב
export const respondToCall = (responseData: { callId: number; volunteerId: number; response: 'going' | 'cant' }) =>
  axios.post(`${API_BASE}/VolunteersCalls/respond`, responseData);

// ✅ עדכון סטטוס מתנדב
export const updateVolunteerStatus = (callId: number, volunteerId: number, status: 'going' | 'arrived' | 'finished', summary?: string) =>
  axios.put(`${API_BASE}/VolunteersCalls/${callId}/${volunteerId}/status`, { status, summary });

export const getAllVolunteers = () =>
  axios.get(`${API_BASE}/Volunteer`);
// ✅ סיום קריאה
export const completeCall = (callId: number, summary: string) =>
  axios.put(`${API_BASE}/Calls/${callId}/complete`, { summary, sentToHospital: false });

// ✅ פרטי מתנדב מה-JWT
export const getVolunteerDetails = async (): Promise<number | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return id ? Number(id) : null;
  } catch {
    return null;
  }

};

// 🧐 פונקציה שבודקת אם מתנדב קיים לפי טלפון או אימייל (דוגמה)
export const checkVolunteerExists = (gmail: string) =>
  axios.get(`${API_BASE}/Volunteer/exists`, {
    params: { gmail },
  });
