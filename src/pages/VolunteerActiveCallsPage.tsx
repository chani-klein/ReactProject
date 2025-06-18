import { useEffect, useState } from "react";
import AlertModal from "../components/AlertModal";
import ActiveCallCard from "../components/ActiveCallCard";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { GetNearby } from "../services/volunteer.service";
import axios from "../services/axios";

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [modalCall, setModalCall] = useState<any | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const fetchCalls = async () => {
    try {
      const res = await axios.get("/Calls"); // ✅ תוקן
      setActiveCalls(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת קריאות:", err);
      setActiveCalls([]);
    }
  };

  const acceptCall = async () => {
    if (!modalCall) return;
    try {
      await axios.put(`/Calls/${modalCall.id}/status`, { status: "בדרך" }); // ✅ תוקן
      setActiveCalls((prev) => [...prev, modalCall]);
      setModalCall(null);
      setAddress(null);
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס לקריאה 'בדרך':", err);
    }
  };

  const declineCall = async () => {
    if (!modalCall) return;
    try {
      await axios.put(`/Calls/${modalCall.id}/status`, { status: "לא זמין" }); // ✅ תוקן
      setModalCall(null);
      setAddress(null);
    } catch (err) {
      console.error("שגיאה בסירוב קריאה:", err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/Calls/${id}/status`, { status }); // ✅ תוקן
      fetchCalls();
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס:", err);
    }
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      return data.display_name || "כתובת לא זמינה";
    } catch (err) {
      console.error("שגיאה בקבלת כתובת ממיקום", err);
      return "כתובת לא זמינה";
    }
  };

  useEffect(() => {
    fetchCalls();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ x: pos.coords.latitude, y: pos.coords.longitude });
      },
      (err) => {
        console.error("⚠️ לא הצלחנו לקבל מיקום", err);
      }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    const interval = setInterval(async () => {
      try {
        const res = await GetNearby(coords.x, coords.y);
        if (res.data.length > 0) {
          const newCall = res.data[0];
          const alreadyExists = activeCalls.some((call) => call.id === newCall.id);
          if (!alreadyExists) {
            const addr = await reverseGeocode(newCall.locationX, newCall.locationY);
            setAddress(addr);
            setModalCall(newCall);
          }
        }
      } catch (err) {
        console.error("שגיאה ב-GetNearby:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [coords, activeCalls]);

  return (
    <BackgroundLayout>
      <h2 style={{ textAlign: "center" }}>📡 קריאות פעילות</h2>

      <AlertModal
        isOpen={!!modalCall}
        call={modalCall}
        address={address}
        onAccept={acceptCall}
        onDecline={declineCall}
        onClose={() => {
          setModalCall(null);
          setAddress(null);
        }}
      />

      {activeCalls.length === 0 && <p>אין קריאות פעילות כרגע</p>}

      {activeCalls.map((call) => (
        <ActiveCallCard key={call.id} call={call} onStatusUpdate={updateStatus} />
      ))}
    </BackgroundLayout>
  );
}
