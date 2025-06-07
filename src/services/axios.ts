import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7219/api",
});

// מוסיף Authorization אוטומטית בכל בקשה – לפי הטוקן המעודכן ב־localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
