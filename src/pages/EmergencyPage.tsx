import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { createCall } from "../services/calls.service";

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
      alert("📢 קריאת חירום נשלחה בהצלחה");
      navigate("/call-confirmation");
    } catch {
      alert("❌ שגיאה בשליחת קריאה");
    }
  };

  return (
    <BackgroundLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <button className="emergency-btn" onClick={sendSosCall}>
          🚨 קריאת SOS מיידית
        </button>
        <button className="regular-btn" onClick={() => navigate("/CreateCallPage")}>
          ✏️ פתח קריאה רגילה
        </button>
      </div>
    </BackgroundLayout>
  );
}
