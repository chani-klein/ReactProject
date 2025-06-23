import { useNavigate } from "react-router";
import BackgroundLayout from "../layouts/BackgroundLayout";

 import "./register.css"; // יבוא קובץ ה-CSS

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <BackgroundLayout>
      <div className="content-wrapper">
        <h1>הורידו כעת את האפליקציה</h1>
        <p>הירשמו עכשיו כדי שתוכלו בזמן אמת להציל חיים</p>
        <div className="button-container">
          <button 
            className="nav-button-primary"
            onClick={() => {  console.log("her");navigate("/register-user"); 
            ;
            }}
          >
            להרשמה
          </button>
          <button 
            className="nav-button-secondary"
            onClick={() => navigate("/register-volunteer")}
          >
            הירשם כמתנדב
          </button>
        </div>
        <p className="helper-text">האפליקציה זמינה עבור כל המכשירים</p>
      </div>
    </BackgroundLayout>
  );
}