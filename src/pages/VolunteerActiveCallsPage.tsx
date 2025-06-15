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
      const res = await axios.get("/Calls");
      setActiveCalls(res.data);
    } catch {
      setActiveCalls([]);
    }
  };

  const acceptCall = async () => {
    if (modalCall) {
      try {
        await axios.put(`/Calls/${modalCall.id}`, {
          status: "בדרך",
        });
        setActiveCalls((prev) => [...prev, modalCall]);
        setModalCall(null);
        setAddress(null);
      } catch (err) {
        console.error("שגיאה בעדכון קריאה:", err);
      }
    }
  };

  const declineCall = async () => {
    if (modalCall) {
      try {
        await axios.put(`/Calls/${modalCall.id}`, {
          status: "לא זמין",
        });
        setModalCall(null);
        setAddress(null);
      } catch (err) {
        console.error("שגיאה בסירוב קריאה:", err);
      }
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await axios.put(`/Calls/${id}`, { status });
    fetchCalls();
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      return data.display_name || "לא נמצאה כתובת";
    } catch (err) {
      console.error("שגיאה בהמרת מיקום לכתובת", err);
      return "שגיאה בכתובת";
    }
  };

  useEffect(() => {
    fetchCalls();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ x: pos.coords.latitude, y: pos.coords.longitude });
      },
      (err) => {
        console.error("⚠️ שגיאה בקבלת מיקום", err);
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
          if (!activeCalls.some((c) => c.id === newCall.id)) {
            alert("📢 קריאה חדשה באזור שלך!");
            if (newCall.locationX && newCall.locationY) {
              const addr = await reverseGeocode(newCall.locationX, newCall.locationY);
              setAddress(addr);
            }
            setModalCall(newCall);
          }
        }
      } catch (err) {
        console.error("שגיאה בקריאה ל-GetNearby", err);
      }
    }, 3000);

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
