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
import type { Call, CallResponse, CallCreateRequest,CompleteCallDto } from "../types/call.types"
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


// 🔧 הצעות עזרה ראשונה - עדכון לנתיב הנכון לפי ה-Swagger
export const getFirstAidSuggestions = async (description: string) => {
  if (!description || typeof description !== "string") return [];

  try {
    // ודא שהנתיב נכון לפי השרת שלך (ai או guides)
    const response = await axios.post(`${API_BASE}/FirstAid/ai`, { description });
    // טיפול בתשובה: אם יש שדה guides או instructions, החזר אותו, אחרת החזר את כל ה-data
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.guides && Array.isArray(response.data.guides)) {
      return response.data.guides;
    } else if (response.data.instructions && Array.isArray(response.data.instructions)) {
      return response.data.instructions;
    } else if (typeof response.data === "string") {
      return [response.data];
    } else {
      // החזר מערך ריק אם לא נמצא מידע מתאים
      return [];
    }
  } catch (err: any) {
    // טיפול בשגיאת 400 או כל שגיאה אחרת
    if (err.response && err.response.data && err.response.data.message) {
      console.error("❌ getFirstAidSuggestions failed:", err.response.data.message);
    } else {
      console.error("❌ getFirstAidSuggestions failed", err);
    }
    return [];
  }
};



// 🔧 קבלת הקריאות שלי (למשתמש שיצר אותן)
export const getMyCalls = async (): Promise<AxiosResponse<Call[]>> => {
  try {
    const response = await axios.get("/Calls/by-user");
    return response;
  } catch (error: any) {
    console.error("❌ Failed to get my calls:", error.response?.data || error.message);
    throw error;
  }
}

// הוספת פונקציה לשליפת קריאות מוקצות למתנדב
export const getAssignedCalls = async (volunteerId: number, status: string) => {
  const res = await axios.get(`/Volunteer/${volunteerId}/calls/by-status/${status}`);
  return res.data;
};

// שליפת קריאות פעילות למתנדב (כולל פרטי קריאה מלאים)
export const getActiveVolunteerCalls = async (volunteerId: number) => {
  const res = await axios.get(`/VolunteersCalls/active/${volunteerId}`)
  return res.data;
}

// עדכון סטטוס מתנדב (ללא summary)
export const updateVolunteerStatus = async (callId: number, volunteerId: number, status: string) => {
  if (!callId || !volunteerId || !status) {
    throw new Error(`Missing data for updateVolunteerStatus: callId=${callId}, volunteerId=${volunteerId}, status=${status}`);
  }
  try {
    const res = await axios.put(`/VolunteersCalls/${callId}/${volunteerId}/status`, {
      Status: status
    }, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ updateVolunteerStatus error:", error.response?.data || error.message);
    throw error;
  }
}
export const finishVolunteerCall = async (
  callId: number,
  volunteerId: number,
  data: CompleteCallDto
) => {
  if (!callId || !volunteerId || !data.summary) {
    throw new Error(`Missing data for finishVolunteerCall`);
  }

  try {
    const res = await axios.put(
      `/VolunteersCalls/${callId}/${volunteerId}/complete`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("❌ finishVolunteerCall error:", error.response?.data || error.message);
    throw error;
  }
};
