// EmergencyPage.tsx - עמוד הבית עם עיצוב מודרני
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { createCall } from "../../services/calls.service";
import "../../style/emergency-styles.css"; // יבוא קובץ ה-CSS
import type { CallResponse } from "../../types/call.types";

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

    // וידוא שהמיקום תקין
    const lat = Number.parseFloat(location.x);
    const lng = Number.parseFloat(location.y);
    if (isNaN(lat) || isNaN(lng)) {
      alert("📍 מיקום לא תקין - אנא נסה שוב");
      return;
    }

    try {
      // שליחת קריאה עם כל השדות הנדרשים
      const sosCallData = {
        description: "קריאת SOS דחופה - נדרשת עזרה מיידית",
        urgencyLevel: 4, // קריטית
        locationX: lng, // longitude
        locationY: lat, // latitude
      };
      const response = await createCall(sosCallData);
      const callId = response.data.id;
      navigate(`/call-confirmation/${callId}`, {
        state: {
          callId,
          message: "קריאת SOS נשלחה בהצלחה!",
          firstAidSuggestions: [],
        },
      });
    } catch (error: any) {
      let errorMessage = "שגיאה בשליחת קריאת SOS";
      if (error.message && error.message.includes("Validation errors:")) {
        errorMessage = `שגיאות אימות:\n${error.message.replace("Validation errors:\n", "")}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <BackgroundLayout>
      <div className="emergency-container">
        <div className="emergency-content">
          <div className="emergency-buttons-layout">
            {/* כפתור חירום ראשי גדול עם עיצוב מודרני */}
            <button 
              className="main-emergency-btn emergency-pulse" 
              onClick={() => navigate("/CreateCallPage")}
              style={{ 
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
              }}
            >
              <div className="btn-content">
                <div className="emergency-icon">🚨</div>
                <div className="emergency-text">פתח קריאת חירום</div>
              </div>
            </button>

            {/* כפתור SOS בצד */}
            <button 
              className="sos-btn-side" 
              onClick={sendSosCall}
              style={{ 
                background: '#ef4444',
                border: '2px solid #dc2626',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
              }}
            >
              <span className="sos-text">🆘<br/>SOS</span>
            </button>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
