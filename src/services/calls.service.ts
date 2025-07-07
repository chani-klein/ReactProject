// import axios from "./axios";


// // פונקציה ליצירת Axios עם Authorization Header
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// // 🟢 התחברות או הרשמה (אזרח)
// export const registerCitizen = (user: any) =>
//   axios.post(`${API_BASE}/User`, user);

// export const loginCitizen = (credentials: any) =>
//   axios.post(`${API_BASE}/login`, credentials);

// // 🟡 פתיחת קריאה
// export const createCall = (formData: FormData) =>
//   axios.post(`${API_BASE}/Calls`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       ...getAuthHeaders(),
//     },
//   });

// export const assignNearbyVolunteers = (callId: number) =>
//   axios.post(`${API_BASE}/Calls/${callId}/assign-nearby`, null, {
//     headers: getAuthHeaders(),
//   });

// // 📋 סיום קריאה
// export const completeCall = (callId: number, formData: any) =>
//   axios.put(`${API_BASE}/Calls/${callId}/complete`, formData, {
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//     },
//   });

// // 🧾 מידע על קריאה
// export const getCallStatus = (callId: number) =>
//   axios.get(`${API_BASE}/Calls/status/${callId}`, {
//     headers: getAuthHeaders(),
//   });

// export const getCallById = (callId: number) =>
//   axios.get(`${API_BASE}/Calls/${callId}`, {
//     headers: getAuthHeaders(),
//   });

// export const getAllCalls = () =>
//   axios.get(`${API_BASE}/Calls`, {
//     headers: getAuthHeaders(),
//   });

// // 🧠 עזרה ראשונה
// export const getFirstAidSuggestions = (description: string) =>
//   axios.post(`${API_BASE}/FirstAid/suggest`, JSON.stringify(description), {
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//     },
//   });

// export const getAllFirstAidGuides = () =>
//   axios.get(`${API_BASE}/FirstAid/all`, {
//     headers: getAuthHeaders(),
//   });
//   export const getMyCalls = () =>
//   axios.get(`${API_BASE}/Calls/by-user`, {
//     headers: getAuthHeaders(),
//   });
import axios from "./axios"
import type { AxiosResponse } from "axios"
import type { Call, CallResponse, CallCreateRequest } from "../types/call.types"
const API_BASE = "https://localhost:7219/api";

// פונקציה ליצירת Axios עם Authorization Header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 🔧 יצירת קריאה חדשה - תיקון הפורמט והוספת לוגים
export const createCall = async (callData: FormData | CallCreateRequest): Promise<import("axios").AxiosResponse<CallResponse>> => {
  try {
    console.log("🚨 Creating emergency call:", callData)

    let formData: FormData

    if (callData instanceof FormData) {
      formData = callData

      // 🔧 הוספת לוגים לראות מה נשלח - תיקון TypeScript
      console.log("📋 FormData contents:")
      try {
        // @ts-ignore - FormData.entries() קיים בדפדפנים מודרניים
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value)
        }
      } catch (e) {
        console.log("Cannot iterate FormData entries")
      }
    } else {
      formData = new FormData()

      // 🔧 וידוא שכל השדות הנדרשים קיימים
      if (!callData.description || callData.description.trim() === "") {
        throw new Error("Description is required")
      }

      if (!callData.locationX || !callData.locationY) {
        throw new Error("Location coordinates are required")
      }

      if (!callData.urgencyLevel || callData.urgencyLevel < 1 || callData.urgencyLevel > 4) {
        throw new Error("Valid urgency level (1-4) is required")
      }

      // 🔧 הוספת שדות עם שמות מדויקים כפי שהשרת מצפה
      formData.append("Description", callData.description.trim())
      formData.append("UrgencyLevel", callData.urgencyLevel.toString())
      formData.append("LocationX", callData.locationX.toString())
      formData.append("LocationY", callData.locationY.toString())

      // 🔧 הוספת שדות נוספים שהשרת עשוי לצפות להם
      formData.append("Status", "Open") // סטטוס ברירת מחדל
      formData.append("CreatedAt", new Date().toISOString()) // תאריך יצירה

      if (callData.fileImage) {
        formData.append("FileImage", callData.fileImage)
      }

      // 🔧 הוספת לוגים לראות מה נשלח - תיקון TypeScript
      console.log("📋 FormData contents:")
      try {
        // @ts-ignore - FormData.entries() קיים בדפדפנים מודרניים
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value)
        }
      } catch (e) {
        console.log("Cannot iterate FormData entries")
      }
    }

    const response = await axios.post(`${API_BASE}/Calls`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("✅ Call created successfully:", response.data)
    return response
  } catch (error: any) {
    console.error("❌ Failed to create call:", error.response?.data || error.message)

    // 🔧 הוספת פירוט שגיאות validation
    if (error.response?.data?.errors) {
      console.error("📋 Validation errors:", error.response.data.errors)

      // יצירת הודעת שגיאה ברורה יותר
      const errorMessages = Object.entries(error.response.data.errors)
        .map(
          ([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`,
        )
        .join("\n")

      throw new Error(`Validation errors:\n${errorMessages}`)
    }

    throw error
  }
}

// 🔧 שיוך מתנדבים קרובים
export const assignNearbyVolunteers = async (callId: number): Promise<AxiosResponse<any>> => {
  try {
    console.log("👥 Assigning nearby volunteers to call:", callId)
    const response = await axios.post(`/Calls/${callId}/assign-nearby`)
    console.log("✅ Volunteers assigned successfully")
    return response
  } catch (error: any) {
    console.error("❌ Failed to assign volunteers:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת סטטוס קריאה
export const getCallStatus = async (
  callId: number,
): Promise<AxiosResponse<{ status: string; volunteersCount?: number }>> => {
  try {
    const response = await axios.get(`/Calls/status/${callId}`)
    return response
  } catch (error: any) {
    console.error("❌ Failed to get call status:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת פרטי קריאה
export const getCallById = async (callId: number): Promise<AxiosResponse<Call>> => {
  try {
    const response = await axios.get(`/Calls/${callId}`)
    return response
  } catch (error: any) {
    console.error("❌ Failed to get call details:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 קבלת כל הקריאות (למנהלים)
export const getAllCalls = async (): Promise<AxiosResponse<Call[]>> => {
  try {
    const response = await axios.get("/Calls")
    return response
  } catch (error: any) {
    console.error("❌ Failed to get all calls:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 סיום קריאה
export const completeCall = async (
  callId: number,
  summary: string,
  sentToHospital = false,
): Promise<AxiosResponse<any>> => {
  try {
    console.log("✅ Completing call:", { callId, summary, sentToHospital })

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData = {
      Summary: summary,
      SentToHospital: sentToHospital,
    }

    const response = await axios.put(`/Calls/${callId}/complete`, serverData)
    console.log("✅ Call completed successfully")
    return response
  } catch (error: any) {
    console.error("❌ Failed to complete call:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 הצעות עזרה ראשונה - תיקון הפורמט
export const getFirstAidSuggestions = async (description: string) => {
  if (!description || typeof description !== "string") return [];

  try {
    const response = await axios.post(`${API_BASE}/FirstAid/suggest`, { description });
    return response.data;
  } catch (err) {
    console.error("❌ getFirstAidSuggestions failed", err);
    return [];
  }
};



// 🔧 קבלת הקריאות שלי (למשתמש שיצר אותן)
export const getMyCalls = async (): Promise<AxiosResponse<Call[]>> => {
  try {
    // נניח שהשרת מחזיר קריאות לפי המשתמש המחובר
    const response = await axios.get("/Calls/my-calls")
    return response
  } catch (error: any) {
    console.error("❌ Failed to get my calls:", error.response?.data || error.message)
    throw error
  }
}

// הוספת פונקציה לשליפת קריאות מוקצות למתנדב
export const getAssignedCalls = async (volunteerId: number) => {
  const res = await axios.get(`/VolunteersCalls/by-volunteer/${volunteerId}`);
  return res.data;
};

// שליפת קריאות פעילות למתנדב (כולל פרטי קריאה מלאים)
export const getActiveVolunteerCalls = async (volunteerId: number) => {
  const res = await axios.get(`/VolunteersCalls/active/${volunteerId}`)
  return res.data;
}

// שליחת תגובת מתנדב לקריאה (going/cant/arrived/finished)
export const respondToVolunteerCall = async (callId: number, volunteerId: number, status: string) => {
  if (!callId || !volunteerId || !status) {
    throw new Error(`Missing data for respondToVolunteerCall: callId=${callId}, volunteerId=${volunteerId}, status=${status}`);
  }
  console.log("🚑 Sending respondToVolunteerCall (via UpdateVolunteerStatus):", { callId, volunteerId, status });
  try {
    // שלח שמות שדות בפורמט PascalCase + Authorization Header
    const res = await axios.put(`/VolunteersCalls/${callId}/${volunteerId}/status`, {
      Status: status, // תואם ל-DTO החדש
     
    }, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error: any) {
    // לוג שגיאה מפורט
    console.error("❌ respondToVolunteerCall error:", error.response?.data || error.message);
    throw error;
  }
}
