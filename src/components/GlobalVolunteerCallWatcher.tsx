import { useEffect, useState } from "react";
import AlertModal from "./AlertModal";
import { getActiveVolunteerCalls } from "../services/calls.service";
import { getVolunteerDetails } from "../services/volunteer.service";

function isRecent(dateString: string, minutes: number = 5) {
  const created = new Date(dateString).getTime();
  const now = Date.now();
  return now - created <= minutes * 60 * 1000;
}

export default function GlobalVolunteerCallWatcher() {
  const [modalCall, setModalCall] = useState<any | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [volunteerId, setVolunteerId] = useState<number | null>(null);

  // חילוץ volunteerId (async)
  useEffect(() => {
    (async () => {
      let id = null;
      if (getVolunteerDetails && typeof getVolunteerDetails === "function") {
        id = await getVolunteerDetails();
      } else {
        id = Number(localStorage.getItem("volunteerId"));
      }
      setVolunteerId(id || null);
    })();
  }, []);

  // פולינג לקריאות פעילות
  useEffect(() => {
    if (!volunteerId) return;
    const interval = setInterval(async () => {
      try {
        const calls = await getActiveVolunteerCalls(volunteerId);
        if (calls && Array.isArray(calls) && calls.length > 0) {
          // סינון קריאות: רק קריאות פעילות, לא אושרו, עד 5 דקות מהיצירה
          const filtered = calls.filter((call: any) => {
            if (call.status !== "Open") return false;
            if (!isRecent(call.createdAt, 5)) return false;
            // בדוק אם המתנדב כבר אישר/סירב/סיים
            if (call.volunteersStatus && Array.isArray(call.volunteersStatus)) {
              const vStatus = call.volunteersStatus.find((v: any) => v.volunteerId === volunteerId);
              if (vStatus && vStatus.response !== "notified") return false;
            }
            return true;
          });
          if (filtered.length > 0) {
            if (!modalCall || (modalCall && modalCall.id !== filtered[0].id)) {
              setModalCall(filtered[0]);
              setAddress(null);
            }
          } else if (modalCall) {
            setModalCall(null);
          }
        } else if (modalCall) {
          setModalCall(null);
        }
      } catch (err) {
        // אפשר להוסיף טיפול בשגיאות
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [volunteerId, modalCall]);

  if (!modalCall) return null;
  // כל הפונקציות async כדי להתאים ל-AlertModal
  const handleAccept = async () => { setModalCall(null); };
  const handleDecline = async () => { setModalCall(null); };
  const handleArrived = async () => { setModalCall(null); };
  const handleFinish = async () => { setModalCall(null); };

  return (
    <AlertModal
      isOpen={!!modalCall}
      call={modalCall}
      address={address}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onArrived={handleArrived}
      onFinish={handleFinish}
      onClose={() => setModalCall(null)}
    />
  );
}
