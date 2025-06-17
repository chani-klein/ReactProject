import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, isValidToken, getRoleFromToken } from "../services/auth.utils";
import HomePage from "../pages/HomePage";

const AuthRedirector = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getSession();

    if (token && isValidToken(token)) {
      const role = getRoleFromToken(token);
      if (role === "User") {
        navigate("/create-call");
      } else if (role === "Volunteer") {
        navigate("/volunteerPage");
      } else {
        navigate("/auth/login");
      }
    }

    setChecking(false);
  }, []);

  if (checking) return null;

  return <HomePage />;
};

export default AuthRedirector;
