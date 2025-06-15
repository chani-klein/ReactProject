import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, isValidToken } from "../services/auth.utils";

const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch {
    return null;
  }
};

const AuthRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getSession();
    if (token && isValidToken(token)) {
      const role = getRoleFromToken(token);

      // ✅ הדפסת התפקיד לקונסול
      console.log("🎭 תפקיד המשתמש הוא:", role);

      if (role === "User") {
        navigate("/create-call");
      } else if (role === "Volunteer") {
        navigate("/volunteerPage");
      }
    }
  }, []);

  return null;
};

export default AuthRedirector;
