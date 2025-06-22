// EmergencyPage.tsx - עמוד הבית עם עיצוב מודרני
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { createCall } from "../../services/calls.service";
import "./emergency-styles.css"; // יבוא קובץ ה-CSS

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ x: string; y: string } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          x: pos.coords.latitude.toString(),
          y: pos.coords.longitude.toString(),
        }),
      () => alert("⚠️ לא הצלחנו לאתר מיקום")
    );
  }, []);

  const sendSosCall = async () => {
    if (!location) {
      alert("📍 אין מיקום זמין עדיין");
      return;
    }

    const data = new FormData();
    data.append("LocationX", location.x);
    data.append("LocationY", location.y);
    data.append("Status", "נפתח");
    data.append("Description", "קריאת SOS");

    try {
      await createCall(data);
      navigate("/call-confirmation");
    } catch {
      alert("❌ שגיאה בשליחת קריאה");
    }
  };

  return (
    <BackgroundLayout>
      <div className="emergency-container">
        <div className="emergency-content">
          {/* כפתור חירום ראשי גדול */}
          <button 
            className="main-emergency-btn emergency-pulse" 
            onClick={() => navigate("/CreateCallPage")}
          >
            <div className="btn-content">
              <div className="emergency-icon">🚨</div>
              <div className="emergency-text">פתח קריאת חירום</div>
            </div>
          </button>

          {/* כפתור SOS קטן */}
          <button className="sos-btn" onClick={sendSosCall}>
            SOS
          </button>

          {/* כפתור קריאה רגילה - מוסתר כרגע
          <button className="regular-call-btn" onClick={() => navigate("/CreateCallPage")}>
            <span className="btn-icon">✏️</span>
            קריאה רגילה
          </button> */}
        </div>
      </div>
    </BackgroundLayout>
  );
}