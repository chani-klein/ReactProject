import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertModal from "../../components/AlertModal";
import ActiveCallCard from "../../components/ActiveCallCard";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { getNearbyCalls } from "../../services/volunteer.service";
import axios from "../../services/axios";

export default function VolunteerActiveCallsPage() {
  const navigate = useNavigate();

  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [modalCall, setModalCall] = useState<any | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const volunteerIdRaw = localStorage.getItem("volunteerId");
  const volunteerId = volunteerIdRaw ? Number(volunteerIdRaw) : Number.NaN;

  const fetchActiveCalls = async () => {
    if (isNaN(volunteerId)) {
      console.warn("⚠️ volunteerId לא תקין");
      return;
    }

    try {
      console.log("🔄 טוען קריאות פעילות למתנדב:", volunteerId);
      const res = await axios.get(`/VolunteerCalls/active/${volunteerId}`);
      setActiveCalls(res.data);
    } catch (err) {
      console.error("❌ שגיאה בטעינת קריאות פעילות:", err);
      setActiveCalls([]);
    }
  };

  const acceptCall = async () => {
    if (!modalCall || isNaN(volunteerId)) return;

    try {
      await axios.post("/VolunteerCalls/respond", {
        callId: modalCall.id,
        volunteerId,
        response: "going",
      });

      setActiveCalls((prev) => [...prev, { ...modalCall, volunteerStatus: "going" }]);
      setModalCall(null);
      setAddress(null);
      await fetchActiveCalls();
    } catch (err) {
      console.error("❌ שגיאה בקבלת קריאה:", err);
    }
  };

  const declineCall = async () => {
    if (!modalCall || isNaN(volunteerId)) return;

    try {
      await axios.post("/VolunteerCalls/respond", {
        callId: modalCall.id,
        volunteerId,
        response: "cant",
      });

      setModalCall(null);
      setAddress(null);
    } catch (err) {
      console.error("❌ שגיאה בסירוב קריאה:", err);
    }
  };

  const updateVolunteerStatus = async (callId: number, newStatus: string) => {
    try {
      await axios.put(`/VolunteerCalls/${callId}/${volunteerId}/status`, {
        status: newStatus,
      });

      if (newStatus === "finished") {
        setActiveCalls((prev) => prev.filter((call) => call.id !== callId));
      } else {
        setActiveCalls((prev) =>
          prev.map((call) =>
            call.id === callId ? { ...call, volunteerStatus: newStatus } : call
          )
        );
      }
    } catch (err) {
      console.error("❌ שגיאה בעדכון סטטוס מתנדב:", err);
    }
  };

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=he`
      );
      const data = await res.json();
      return data.display_name || "כתובת לא זמינה";
    } catch (err) {
      console.error("❌ שגיאה בקבלת כתובת ממיקום", err);
      return "כתובת לא זמינה";
    }
  };

  useEffect(() => {
    if (!isNaN(volunteerId)) {
      fetchActiveCalls();
    } else {
      console.error("❌ volunteerId לא תקין, מעביר לדף התחברות");
      navigate("/login");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ x: pos.coords.latitude, y: pos.coords.longitude });
      },
      (err) => {
        console.error("❌ לא הצלחנו לקבל מיקום", err);
      }
    );
  }, [volunteerId]);

  useEffect(() => {
    if (!coords || isNaN(volunteerId)) return;

    const interval = setInterval(async () => {
      try {
        const res = await getNearbyCalls(volunteerId);
        if (res.data.length > 0) {
          const newCall = res.data[0];
          const alreadyActive = activeCalls.some((call) => call.id === newCall.id);

          if (!alreadyActive && !modalCall) {
            const addr = await reverseGeocode(newCall.locationX, newCall.locationY);
            setAddress(addr);
            setModalCall(newCall);
          }
        }
      } catch (err) {
        console.error("❌ שגיאה בחיפוש קריאות חדשות:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [coords, activeCalls, volunteerId, modalCall]);

  return (
    <BackgroundLayout>
      <div className="page-header">
        <h2 style={{ textAlign: "center" }}>📡 קריאות פעילות</h2>
        <button
          onClick={fetchActiveCalls}
          className="btn btn-secondary"
          style={{ margin: "1rem auto", display: "block" }}
        >
          🔄 רענן רשימה
        </button>
      </div>

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

      {activeCalls.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>🔍 אין קריאות פעילות כרגע</p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            המערכת מחפשת קריאות חדשות באזור שלך...
          </p>
        </div>
      ) : (
        activeCalls.map((call) => (
          <ActiveCallCard
            key={call.id}
            call={call}
            onStatusUpdate={updateVolunteerStatus}
          />
        ))
      )}
    </BackgroundLayout>
  );
}
