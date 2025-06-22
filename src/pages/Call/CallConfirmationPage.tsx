import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { getCallStatus } from "../../services/calls.service";

export default function CallConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const callId = (location.state as any)?.callId;
  const description = (location.state as any)?.description || "";

  const [status, setStatus] = useState("נשלחה");
  const [guides, setGuides] = useState<{ title: string; description: string }[]>([]);

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

  // קריאה להוראות GPT
  useEffect(() => {
    const fetchGuideFromAI = async () => {
      if (!description) return;

      try {
        const res = await axios.post("http://localhost:5000/api/firstaid/ai", description, {
          headers: { "Content-Type": "application/json" },
        });

        setGuides([{ title: "הוראות עזרה ראשונה", description: res.data }]);
      } catch (err) {
        console.error("שגיאה בקבלת הוראות AI", err);
      }
    };

    fetchGuideFromAI();
  }, [description]);

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
              {guides.map((guide, index) => (
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

        
      </div>
    </BackgroundLayout>
  );
}
