import axios from "./axios"; // זה הקובץ שמכיל את baseURL

export const registerUser = (user: any) => {
  return axios.post("/User", user);
};

export const loginUser = (credentials: { gmail: string; password: string }) => {
  return axios.post("/login", credentials);
};
