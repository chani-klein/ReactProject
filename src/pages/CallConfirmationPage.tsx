import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { getCallStatus } from "../services/calls.service";

export default function CallConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const guides = (location.state as any)?.guides || [];
  const callId = (location.state as any)?.callId;

  const [status, setStatus] = useState("נשלחה");

  useEffect(() => {
    if (!callId) return;

    const interval = setInterval(async () => {
      try {
        const response = await getCallStatus(callId);
        setStatus(response.data.status);
      } catch (err) {
        console.error("שגיאה בקבלת סטטוס", err);
      }
    }, 3000); // כל 3 שניות

    return () => clearInterval(interval); // ניקוי
  }, [callId]);

  return (
    <BackgroundLayout>
      <div style={{ direction: "rtl", textAlign: "right" }}>
        <h2 style={{ color: "green" }}>✔️ הקריאה נשלחה בהצלחה</h2>

        <div style={{ fontWeight: "bold", color: "#d80000", fontSize: "1.2rem", marginBottom: "1rem" }}>
          🚑 כעת יצאו כוננים לאזור שלך!
        </div>

        <div style={{ fontSize: "1rem", color: "#555", marginBottom: "2rem" }}>
          סטטוס הקריאה: <strong style={{ color: "#007bff" }}>{status}</strong>
        </div>

        {guides.length > 0 && (
          <>
            <h3 style={{ color: "#d80000" }}>📋 הוראות עזרה ראשונה:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {guides.map((guide: any, index: number) => (
                <div
                  key={index}
                  style={{
                    background: "#fff7f7",
                    border: "1px solid #d80000",
                    borderRadius: "1rem",
                    padding: "1rem",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h4 style={{ marginBottom: "0.5rem", color: "#b00000" }}>{guide.title}</h4>
                  <p>{guide.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "2rem",
            padding: "0.8rem 1.2rem",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "1rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          חזור למסך הבית
        </button>
      </div>
    </BackgroundLayout>
  );
}
