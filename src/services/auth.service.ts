// auth.service.ts
import axios from "./axios"; // axios שהוגדר עם baseURL

export const registerUser = (user: any) => {
  return axios.post("/User", user); // ודא שהשרת אכן מקבל כאן את הרישום
};

export const loginUser = (credentials: { gmail: string; password: string }) => {
  return axios.post("/login", credentials); // ודא שהשרת מחזיר token בתשובה
};
