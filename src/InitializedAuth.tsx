import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSession, isValidToken } from "./services/auth.utils";

const InitializedAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getSession();

    // אם אין טוקן בכלל, פשוט נותנים לו להישאר בעמוד הנוכחי (למשל HomePage)
    if (!token) return;

    // אם יש טוקן לא תקף – מפנים ל־Login
    if (!isValidToken(token)) {
      navigate("/auth/login");
      return;
    }

    // אם יש טוקן תקף – מנווטים לפי role
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "User") {
      navigate("/create-call-page");
    } else if (role === "Volunteer") {
      navigate("/create-call");
    }
  }, [navigate, location]);

  return null;
};

export default InitializedAuth;
