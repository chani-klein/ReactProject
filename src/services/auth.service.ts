// // auth.service.ts
// import axios from "./axios"; // axios שהוגדר עם baseURL
// import { setSession, removeSession } from "../auth/auth.utils";


// export const refreshTokenIfVolunteer = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) return;

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

//     // אם לא מתנדב – לא עושים כלום
//     if (role !== "Volunteer") return;

//     const res = await axios.post("/LoginControllerVolunteer/refresh-token", null, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const { token: newToken } = res.data;
//     setSession(newToken);
//   } catch (err) {
//     console.error("❌ לא הצלחנו לרענן טוקן למתנדב", err);
//     removeSession();
//   }
// };

// export const checkUserExists = (gmail: string) => {
//   return axios.get(`/User/exists?gmail=${encodeURIComponent(gmail)}`);
// };
// export const registerUser = (user: any) => {
//   return axios.post("/User", user); // ודא שהשרת אכן מקבל כאן את הרישום
// };import axios from "./axios"
import axios from "./axios"
import type { AxiosResponse } from "axios"
import type { UserRegisterData, VolunteerRegisterData, LoginCredentials, AuthResponse } from "../types"

// 🔧 הרשמת משתמש רגיל
export const registerUser = async (user: UserRegisterData): Promise<AxiosResponse<AuthResponse>> => {
  try {
    console.log("🔐 Registering user:", { ...user, password: "[HIDDEN]" })

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData = {
      FirstName: user.firstName,
      LastName: user.lastName,
      PhoneNumber: user.phoneNumber,
      Email: user.email, // 🔧 שינוי ל-Email עם E גדולה
      Password: user.password,
      Role: user.role,
    }

    const response = await axios.post("/User", serverData)

    // שמירת טוקן אם התקבל
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
      }
    }

    return response
  } catch (error: any) {
    console.error("❌ User registration failed:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 הרשמת מתנדב
export const registerVolunteer = async (volunteer: VolunteerRegisterData): Promise<AxiosResponse<AuthResponse>> => {
  try {
    console.log("🚑 Registering volunteer:", { ...volunteer, password: "[HIDDEN]" })

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData = {
      FullName: volunteer.fullName,
      Email: volunteer.email, // 🔧 שינוי ל-Email עם E גדולה
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

    return response
  } catch (error: any) {
    console.error("❌ Volunteer registration failed:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 התחברות
export const loginUser = async (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> => {
  try {
    console.log("🔑 Logging in user:", credentials.email)

    // 🔧 התאמה לשרת C# - שמות שדות עם אות גדולה
    const serverData = {
      Email: credentials.email, // 🔧 שינוי ל-Email עם E גדולה
      Password: credentials.password,
    }

    const response = await axios.post("/Person/login", serverData)

    // שמירת נתוני אימות
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
      }

      // חילוץ נתונים מהטוקן
      try {
        const tokenPayload = JSON.parse(atob(response.data.token.split(".")[1]))

        // שמירת role
        const role =
          tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || tokenPayload["role"]
        if (role) {
          localStorage.setItem("userRole", role)
        }

        // שמירת ID אם זה מתנדב
        if (role === "Volunteer") {
          const volunteerId =
            tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            tokenPayload["nameid"] ||
            tokenPayload["sub"] ||
            response.data.id
          if (volunteerId) {
            localStorage.setItem("volunteerId", volunteerId.toString())
          }
        }

        console.log("✅ Login successful:", { role, id: response.data.id })
      } catch (tokenError) {
        console.warn("⚠️ Could not parse token:", tokenError)
      }
    }

    return response
  } catch (error: any) {
    console.error("❌ Login failed:", error.response?.data || error.message)
    throw error
  }
}

// 🔧 יציאה מהמערכת
export const logout = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("volunteerId")
  localStorage.removeItem("userRole")
  console.log("👋 User logged out")
}

// 🔧 בדיקת סטטוס התחברות
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token")
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Date.now() / 1000

    if (payload.exp < currentTime) {
      console.log("⏰ Token expired")
      logout()
      return false
    }

    return true
  } catch (error) {
    console.error("❌ Invalid token:", error)
    logout()
    return false
  }
}

// 🔧 קבלת role של המשתמש
export const getUserRole = (): string | null => {
  return localStorage.getItem("userRole")
}
