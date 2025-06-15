import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, isValidToken } from "./services/auth.utils";

// כלי עזר לפיענוח טוקן
const getRoleFromToken = (token: string): string | null => {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch {
    return null;
  }
};

const InitializedAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getSession();

    if (!token || !isValidToken(token)) {
      navigate("/auth/login");
      return;
    }

    const role = getRoleFromToken(token);

    if (role === "User") {
      navigate("/create-call"); // עמוד של משתמש רגיל
    } else if (role === "Volunteer") {
      navigate("/volunteerPage"); // עמוד ראשי של מתנדב
    }
  }, []);

  return null;
};

export default InitializedAuth;
