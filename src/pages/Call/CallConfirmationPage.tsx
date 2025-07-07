// CallConfirmationPage.tsx - עמוד אישור קריאה עם עיצוב מודרני
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCallStatus } from "../../services/calls.service";
import { getVolunteersForCall } from "../../services/calls.service"; // Ensure this function exists in the service
import { getAIFirstAidGuide } from "../../services/firstAid.service";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import "../../style/emergency-styles.css"; // יבוא קובץ ה-CSS

export default function CallConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const callId = (location.state as any)?.callId;
  const description = (location.state as any)?.description || "";

  const [status, setStatus] = useState("נשלחה");
  const [guides, setGuides] = useState<{ title: string; description: string }[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [volunteers, setVolunteers] = useState<string[]>([]); // Add state for volunteers
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(false); // Add loading state for volunteers

  // סטטוס הקריאה כל 3 שניות
  useEffect(() => {
    if (!callId) return;

    const interval = setInterval(async () => {
      try {
        const response = await getCallStatus(callId);
        setStatus(response.data.status);
      } catch (err) {
        console.error("שגיאה בקבלת סטטוס", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [callId]);

  // תמיד לקרוא ל-AI בלי קשר ל-guides קיימים
  useEffect(() => {
    const fetchGuideFromAI = async () => {
      if (!description) return;

      setIsLoadingGuides(true);
      try {
        // שימוש בפונקציה מהשרת
        const aiGuide = await getAIFirstAidGuide(description);
        setGuides([{ title: "הוראות עזרה ראשונה", description: aiGuide }]);
      } catch (err) {
        console.error("שגיאה בקבלת הוראות AI", err);
      } finally {
        setIsLoadingGuides(false);
      }
    };

    fetchGuideFromAI();
  }, [description]);

  const fetchVolunteers = async () => {
    if (!callId) {
      console.error("Missing callId");
      return;
    }

    setIsLoadingVolunteers(true);
    try {
      const response = await getVolunteersForCall(callId);
      setVolunteers(response.data);
    } catch (err) {
      console.error("שגיאה בקבלת רשימת מתנדבים", err);
    } finally {
      setIsLoadingVolunteers(false);
    }
  };

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case "נשלחה":
      case "נפתח":
        return "var(--warning-orange)";
      case "בטיפול":
        return "var(--primary-blue)";
      case "נסגר":
        return "var(--success-green)";
      default:
        return "var(--text-gray)";
    }
  };

  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
      case "נשלחה":
      case "נפתח":
        return "🚨";
      case "בטיפול":
        return "🚑";
      case "נסגר":
        return "✅";
      default:
        return "📋";
    }
  };

  return (
    <BackgroundLayout>
      <div className="confirmation-container sos-confirmation">
        <div className="sos-header">
          <div className="sos-circle">
            <span className="sos-text">SOS</span>
          </div>
          <h2 className="confirmation-title success-bounce">
            ✔️ הקריאה נשלחה בהצלחה
          </h2>
        </div>

        <div className="alert-message">
          <div className="alert-message-text">
            🚑 כעת יצאו כוננים לאזור שלך!
          </div>
          <div style={{ fontSize: "1rem", color: "var(--emergency-text-red)" }}>
            אנא הישאר במקום ושמור על קשר
          </div>
        </div>

        <div className="status-container">
          <div className="status-text">
            {getStatusIcon(status)} סטטוס הקריאה:{" "}
            <span className="status-value" style={{ color: getStatusColor(status) }}>
              {status}
            </span>
          </div>
        </div>

        {/* כפתורים לניווט */}
        <div className="action-buttons">
          <button className="secondary-btn" onClick={() => navigate("/")}>
            🏠 חזור לעמוד הבית
          </button>
          <button className="primary-btn" onClick={() => navigate("/my-calls")}>
            📋 הקריאות שלי
          </button>
          <button className="secondary-btn" onClick={fetchVolunteers}>
            📋 הצג רשימת מתנדבים
          </button>
        </div>

        {/* הוראות עזרה ראשונה */}
        {(guides.length > 0 || isLoadingGuides) && (
          <div className="guides-section">
            <h3 className="guides-title">📋 הוראות עזרה ראשונה</h3>

            {isLoadingGuides ? (
              <div className="loading-container">
                <span className="loading-spinner"></span>
                <span>טוען הוראות עזרה ראשונה...</span>
              </div>
            ) : (
              <div className="guides-container">
                {guides.map((guide, index) => (
                  <div key={index} className="guide-card">
                    <h4 className="guide-title">🩺 {guide.title}</h4>
                    <div className="guide-description">{guide.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Display volunteers list */}
        {isLoadingVolunteers ? (
          <div className="loading-container">
            <span className="loading-spinner"></span>
            <span>טוען רשימת מתנדבים...</span>
          </div>
        ) : volunteers.length > 0 ? (
          <div className="volunteers-list">
            <h3 className="volunteers-title">רשימת מתנדבים</h3>
            <ul>
              {volunteers.map((volunteer: any, index) => (
                <li key={index}>
                  {volunteer.fullName} - {volunteer.phoneNumber} - {volunteer.city}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* הודעת זהירות */}
        <div className="warning-note">
          <strong>⚠️ חשוב:</strong> הוראות אלו הן לעזרה ראשונה בלבד. אל תחליף טיפול רפואי מקצועי.
        </div>
      </div>
    </BackgroundLayout>
  );
}

