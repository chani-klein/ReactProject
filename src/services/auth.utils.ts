// auth.utils.ts

export const setSession = (token: string) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const getSession = (): string | null => {
  return localStorage.getItem("token");
};

export const removeSession = () => {
  localStorage.removeItem("token");
};

export const isValidToken = (token: string): boolean => {
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
export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch {
    return null;
  }
};

