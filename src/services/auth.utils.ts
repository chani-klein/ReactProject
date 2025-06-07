export const setSession = (token: string) => {
  console.log("🧪 setSession: token =", token); // לצורך דיבוג
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const getSession = () => {
  return localStorage.getItem("token");
};

export const removeSession = () => {
  localStorage.removeItem("token");
};

export const isValidToken = (token: string) => {
  if (!token) return false;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};