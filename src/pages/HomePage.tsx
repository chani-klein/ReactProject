import React from "react";
import { useNavigate } from "react-router";
import "../../src/style/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content">
        <h1>הורידו כעת את האפליקציה</h1>
        <p>הירשמו עכשיו כדי שתוכלו בזמן אמת להציל חיים</p>
        <div className="buttons">
          <button onClick={() => navigate("/register-user")} className="btn">
            להרשמה
          </button>
          <button onClick={() => navigate("/register-volunteer")} className="btn outlined">
            הירשם כמתנדב
          </button>
        </div>
      </div>
    </div>
  );
}
