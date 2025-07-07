import axios from "./axios"
import type { AxiosResponse } from "axios"
import type { Call, Volunteer } from "../types"

// import axios from './axios';
// import type { AxiosResponse } from 'axios';
// import type { Call } from '../types/call.types'; // התאם את הנתיב לממשק Call
const API_BASE = 'https://localhost:7219/api';

// // 🟢 התחברות או הרשמה (מתנדב)
// export const registerVolunteer = (volunteer: any) =>
//   axios.post(`${API_BASE}/Volunteer`, volunteer);

// export const loginVolunteer = (credentials: any) =>
//   axios.post(`${API_BASE}/VolunteerLogin`, credentials);

// // 🔔 שליחת התראות למתנדבים
// export const getNearbyCalls = (volunteerId: number): Promise<AxiosResponse<Call[]>> =>
//   axios.get(`${API_BASE}/Volunteer/nearby-alerts`, {
//     params: { id: volunteerId },
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}` // טוקן JWT
//     }
//   }).catch((error) => {
//     console.error('שגיאה באיתור קריאות:', error);
//     throw error;
//   });

// // 📡 מידע על מתנדבים בקריאה
// export const getCallVolunteersInfo = (callId: number) =>
//   axios.get(`${API_BASE}/VolunteersCalls/${callId}/info`);

// // 📋 היסטוריה וקריאות פעילות
// export const getVolunteerHistory = (volunteerId: number) =>
//   axios.get(`${API_BASE}/VolunteersCalls/history/${volunteerId}`);

// export const getActiveCalls = (volunteerId: number) =>
//   axios.get(`${API_BASE}/VolunteersCalls/active/${volunteerId}`);

// // 🚑 תגובת מתנדב
// export const respondToCall = (responseData: { callId: number; volunteerId: number; response: 'going' | 'cant' }) =>
//   axios.post(`${API_BASE}/VolunteersCalls/respond`, responseData);

// // ✅ עדכון סטטוס מתנדב
// export const updateVolunteerStatus = (callId: number, volunteerId: number, status: 'going' | 'arrived' | 'finished', summary?: string) =>
//   axios.put(`${API_BASE}/VolunteersCalls/${callId}/${volunteerId}/status`, { status, summary });

// export const getAllVolunteers = () =>
//   axios.get(`${API_BASE}/Volunteer`);
// // ✅ סיום קריאה
// export const completeCall = (callId: number, summary: string) =>
//   axios.put(`${API_BASE}/Calls/${callId}/complete`, { summary, sentToHospital: false });

// // ✅ פרטי מתנדב מה-JWT
// export const getVolunteerDetails = async (): Promise<number | null> => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) return null;

//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
//     return id ? Number(id) : null;
//   } catch {
//     return null;
//   }

// };

// 🔧 פונקציה מאוחדת לקבלת volunteer ID
const getVolunteerIdFromStorage = (): number | null => {
  // בדיקה ב-localStorage קודם
  const storedId = localStorage.getItem("volunteerId")
  if (storedId && !isNaN(Number(storedId))) {
    return Number(storedId)
  }

  // חילוץ מ-JWT
  try {
    const token = localStorage.getItem("token")
    if (!token) return null

    const payload = JSON.parse(atob(token.split(".")[1]))

    // בדיקת שדות אפשריים ב-JWT
    const possibleFields = [
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
      "nameid",
      "volunteerId",
      "id",
      "sub",
    ]

    for (const field of possibleFields) {
      if (payload[field] && !isNaN(Number(payload[field]))) {
        const id = Number(payload[field])
        localStorage.setItem("volunteerId", id.toString())
        return id
      }
    }
  } catch (error) {
    console.error("❌ Error extracting volunteer ID from token:", error)
  }

  return null
}

// 🔧 קבלת קריאות קרובות
export const getNearbyCalls = async (): Promise<AxiosResponse<Call[]>> => {
  try {
    const volunteerId = getVolunteerIdFromStorage()
    if (!volunteerId) {
      throw new Error("Volunteer ID not found - please login again")
    }

    console.log("📍 Getting nearby calls for volunteer:", volunteerId)

    const response = await axios.get("/Volunteer/nearby-alerts", {
      params: { id: volunteerId },
    })

    console.log("✅ Found nearby calls:", response.data.length)
    return response
  } catch (error: any) {
    console.error("❌ Failed to get nearby calls:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 תגובה לקריאה
export const respondToCall = async (callId: number, response: "going" | "cant"): Promise<AxiosResponse<any>> => {
  try {
    const volunteerId = getVolunteerIdFromStorage()
    if (!volunteerId) {
      throw new Error("Volunteer ID not found - please login again")
    }

    console.log("🚑 Volunteer responding to call:", { callId, volunteerId, response })

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData = {
      CallId: callId, // C גדולה
      VolunteerId: volunteerId, // V גדולה
      Response: response, // R גדולה
    }

    const apiResponse = await axios.post("/VolunteersCalls/respond", serverData)
    console.log("✅ Response sent successfully")
    return apiResponse
  } catch (error: any) {
    console.error("❌ Failed to respond to call:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 עדכון סטטוס מתנדב
export const updateVolunteerStatus = async (
  callId: number,
  status: "going" | "arrived" | "finished",
 
): Promise<AxiosResponse<any>> => {
  try {
    const volunteerId = getVolunteerIdFromStorage()
    if (!volunteerId) {
      throw new Error("Volunteer ID not found - please login again")
    }

    console.log("📝 Updating volunteer status:", { callId, volunteerId, status })

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData: any = {
      Status: status, // S גדולה
    }

    

    const response = await axios.put(`/VolunteersCalls/${callId}/${volunteerId}/status`, serverData)
    console.log("✅ Status updated successfully")
    return response
  } catch (error: any) {
    console.error("❌ Failed to update status:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת היסטוריית קריאות
export const getVolunteerHistory = async (): Promise<AxiosResponse<Call[]>> => {
  try {
    const volunteerId = getVolunteerIdFromStorage()
    if (!volunteerId) {
      throw new Error("Volunteer ID not found - please login again")
    }

    console.log("📚 Getting volunteer history for:", volunteerId)

    const response = await axios.get(`/VolunteersCalls/history/${volunteerId}`)
    return response
  } catch (error: any) {
    console.error("❌ Failed to get volunteer history:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת קריאות פעילות
export const getActiveCalls = async (): Promise<AxiosResponse<Call[]>> => {
  try {
    const volunteerId = getVolunteerIdFromStorage()
    if (!volunteerId) {
      throw new Error("Volunteer ID not found - please login again")
    }

    console.log("🔄 Getting active calls for volunteer:", volunteerId)

    const response = await axios.get(`/VolunteersCalls/active/${volunteerId}`)
    return response
  } catch (error: any) {
    console.error("❌ Failed to get active calls:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת מידע על מתנדבים בקריאה
export const getCallVolunteersInfo = async (callId: number): Promise<AxiosResponse<any>> => {
  if (!callId || typeof callId !== "number" || isNaN(callId)) {
    throw new Error("callId לא תקין ב-getCallVolunteersInfo");
  }
  try {
    console.log("👥 Getting volunteers info for call:", callId)
    const response = await axios.get(`/VolunteersCalls/${callId}/info`)
    return response
  } catch (error: any) {
    console.error("❌ Failed to get call volunteers info:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת כל המתנדבים (למנהלים)
export const getAllVolunteers = async (): Promise<AxiosResponse<Volunteer[]>> => {
  try {
    const response = await axios.get("/Volunteer")
    return response
  } catch (error: any) {
    console.error("❌ Failed to get all volunteers:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת פרטי מתנדב
export const getVolunteerDetails = async (): Promise<number | null> => {
  return getVolunteerIdFromStorage()
}


// 🔧 הרשמת מתנדב
export const registerVolunteer = async (volunteer: any): Promise<AxiosResponse<any>> => {
  try {
    console.log("🚑 Registering volunteer:", { ...volunteer, password: "[HIDDEN]" })

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData = {
      FullName: volunteer.fullName,
      Gmail: volunteer.Gmail, // שינוי Email ל-Gmail
      Password: volunteer.password,
      PhoneNumber: volunteer.phoneNumber,
      Specialization: volunteer.specialization,
      Address: volunteer.address,
      City: volunteer.city,
      Role: volunteer.role,
    }

    const response = await axios.post("/Volunteer", serverData)

    // שמירת טוקן ו-volunteer ID
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
      }
      if (response.data.id) {
        localStorage.setItem("volunteerId", response.data.id.toString())
      }
    }

    return response;
  } catch (error: any) {
    console.error("❌ Volunteer registration failed:", error.response?.data || error.message);
    throw error;
  }
};
