import { useNavigate } from "react-router-dom";
import BackgroundLayout from "../layouts/BackgroundLayout";
import "../layouts/BackgroundLayout.css" // אם יש לך עיצוב לכפתור

export default function EmergencyPage() {
  const navigate = useNavigate();

  return (
    <BackgroundLayout>
      <button className="emergency-btn" onClick={() => navigate("/create-callPage")}>
        פתח קריאת חירום
      </button>
    </BackgroundLayout>
  );
}
