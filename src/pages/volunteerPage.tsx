import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "../services/axios";
import { getSession } from "../services/auth.utils";
import BackgroundLayout from "../layouts/BackgroundLayout";

Modal.setAppElement("#root");

export default function VolunteerAlertsPage() {
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [nearbyCall, setNearbyCall] = useState<any>(null);

  const getVolunteerIdFromToken = (): number | null => {
    const token = getSession();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return parseInt(payload["nameid"] || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const volunteerId = getVolunteerIdFromToken();
      if (!volunteerId) return;

      try {
        const res = await axios.get("/api/Volunteer/nearby-alerts", {
          params: { id: volunteerId },
        });

        if (res.data.length > 0) {
          const call = res.data[0];
          setNearbyCall(call);
          setCallModalOpen(true);

          const audio = new Audio("/sounds/alert.mp3");
          audio.play();
        }
      } catch (err) {
        console.error("שגיאה בקבלת קריאות מתאימות:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Modal
        isOpen={callModalOpen}
        onRequestClose={() => setCallModalOpen(false)}
        style={{
          content: {
            direction: "rtl",
            maxWidth: "500px",
            margin: "auto",
            padding: "2rem",
            borderRadius: "1rem",
            backgroundColor: "#fff",
          },
        }}
      >
        {nearbyCall && (
          <div>
            <h2>📢 קריאה חדשה באזור שלך!</h2>
            <p><strong>תיאור:</strong> {nearbyCall.description}</p>
            <p><strong>רמת דחיפות:</strong> {nearbyCall.urgencyLevel}</p>
            <button
              onClick={() => {
                alert("🚑 סימנת שאת בדרך!");
                setCallModalOpen(false);
              }}
              style={{
                backgroundColor: "#4caf50",
                color: "#fff",
                padding: "0.8rem",
                borderRadius: "1rem",
                marginTop: "1rem",
                border: "none",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              אני בדרך 🚑
            </button>
          </div>
        )}
      </Modal>

      <BackgroundLayout>
        <h2 style={{ textAlign: "center", color: "#444" }}>🔔 בדיקת קריאות בזמן אמת</h2>
        <p style={{ textAlign: "center", color: "#888" }}>
          הדף הזה סורק  האם יש קריאה קרובה עבורך כמתנדב
        </p>
      </BackgroundLayout>
    </>
  );
}
