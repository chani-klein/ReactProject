// hooks/useNearbyCallPolling.ts
import { useEffect } from "react";
import { useCallContext } from "../contexts/CallContext";
import { getNearbyCalls } from "../services/volunteer.service";
import type { Call } from "../types/call.types"; // ✅ תיקון נתיב + הסרת הנקודה

export const useNearbyCallPolling = (volunteerId: number) => {
  const { popupCall, setPopupCall } = useCallContext();

  useEffect(() => {
     console.log("🔁 useEffect הופעל");
    const interval = setInterval(async () => {
      console.log("🔁 בדיקה לקריאות חדשות...");
      try {
        const res = await getNearbyCalls(volunteerId); // ודא שהמתנדב מחובר
        console.log("📦 תוצאה מהשרת:", res.data);

        const newCall = res.data.find((call: Call) => call.status === "פתוחה"); // ✅ שם משתנה ברור

        if (newCall) {
          console.log("🚨 קריאה חדשה:", newCall);
          setPopupCall(newCall);
        }
      } catch (err) {
        console.error("❌ שגיאה בקבלת קריאות:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [volunteerId]); // ✅ שים לב שיש תלות ב-volunteerId
};
