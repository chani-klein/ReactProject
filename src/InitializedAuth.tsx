import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, isValidToken } from "./services/auth.utils";

const InitializedAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getSession();

    if (!token) return;

    if (!isValidToken(token)) {
      navigate("/auth/login");
      return;
    }

    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "User") {
      navigate("/create-call-page");
    } else if (role === "Volunteer") {
      navigate("/create-call");
    }
  }, []); // ✅ רק פעם אחת

  return null;
};

export default InitializedAuth;
