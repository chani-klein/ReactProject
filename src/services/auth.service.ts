// auth.service.ts
import axios from "./axios"; // axios שהוגדר עם baseURL
import { setSession, removeSession } from "../auth/auth.utils";


export const refreshTokenIfVolunteer = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // אם לא מתנדב – לא עושים כלום
    if (role !== "Volunteer") return;

    const res = await axios.post("/LoginControllerVolunteer/refresh-token", null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { token: newToken } = res.data;
    setSession(newToken);
  } catch (err) {
    console.error("❌ לא הצלחנו לרענן טוקן למתנדב", err);
    removeSession();
  }
};

export const checkUserExists = (gmail: string) => {
  return axios.get(`/User/exists?gmail=${encodeURIComponent(gmail)}`);
};
export const registerUser = (user: any) => {
  return axios.post("/User", user); // ודא שהשרת אכן מקבל כאן את הרישום
};

export const loginUser = (credentials: { gmail: string; password: string }) => {
  return axios.post("/login", credentials); // ודא שהשרת מחזיר token בתשובה
};
