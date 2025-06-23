"use client"
import { useEffect, useState } from "react"
import AlertModal from "../../components/AlertModal"
import ActiveCallCard from "../../components/ActiveCallCard"
import BackgroundLayout from "../../layouts/BackgroundLayout"
import { getNearbyCalls } from "../../services/volunteer.service"
import axios from "../../services/axios"

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<any[]>([])
  const [modalCall, setModalCall] = useState<any | null>(null)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  const volunteerIdRaw = localStorage.getItem("volunteerId")
  const volunteerId = volunteerIdRaw ? Number(volunteerIdRaw) : Number.NaN

  const fetchActiveCalls = async () => {
    if (isNaN(volunteerId)) {
      console.warn("⚠️ volunteerId לא תקין")
      return
    }

    try {
      console.log("🔄 טוען קריאות פעילות למתנדב:", volunteerId)
      const res = await axios.get(`/VolunteerCalls/active/${volunteerId}`)
      console.log("✅ קריאות פעילות נטענו:", res.data)
      setActiveCalls(res.data)
    } catch (err) {
      console.error("❌ שגיאה בטעינת קריאות פעילות:", err)
      setActiveCalls([])
    }
  }

  const acceptCall = async () => {
    if (!modalCall || isNaN(volunteerId)) {
      console.error("❌ חסרים נתונים לקבלת הקריאה")
      return
    }

    try {
      console.log("🚑 מקבל קריאה:", modalCall.id, "מתנדב:", volunteerId)

      await axios.post("/VolunteerCalls/respond", {
        callId: modalCall.id,
        volunteerId: volunteerId,
        response: "going",
      })

      console.log("✅ קריאה התקבלה בהצלחה")

      // ✅ הוסף את הקריאה לרשימה המקומית
      setActiveCalls((prev) => [...prev, { ...modalCall, volunteerStatus: "going" }])

      // ✅ סגור את המודל
      setModalCall(null)
      setAddress(null)

      // ✅ רענן את הרשימה
      await fetchActiveCalls()
    } catch (err) {
      console.error("❌ שגיאה בקבלת קריאה:", err)
      throw err
    }
  }

  const declineCall = async () => {
    if (!modalCall || isNaN(volunteerId)) {
      console.error("❌ חסרים נתונים לסירוב הקריאה")
      return
    }

    try {
      console.log("❌ מסרב לקריאה:", modalCall.id)

      await axios.post("/VolunteerCalls/respond", {
        callId: modalCall.id,
        volunteerId: volunteerId,
        response: "cant",
      })

      console.log("✅ סירוב נשמר בהצלחה")
      setModalCall(null)
      setAddress(null)
    } catch (err) {
      console.error("❌ שגיאה בסירוב קריאה:", err)
      throw err
    }
  }

  const updateVolunteerStatus = async (callId: number, newStatus: string) => {
    try {
      console.log("🔄 מעדכן סטטוס מתנדב:", callId, newStatus)

      await axios.put(`/VolunteerCalls/${callId}/${volunteerId}/status`, {
        status: newStatus,
      })

      console.log("✅ סטטוס מתנדב עודכן")

      if (newStatus === "finished") {
        setActiveCalls((prev) => prev.filter((call) => call.id !== callId))
      } else {
        setActiveCalls((prev) =>
          prev.map((call) => (call.id === callId ? { ...call, volunteerStatus: newStatus } : call)),
        )
      }
    } catch (err) {
      console.error("❌ שגיאה בעדכון סטטוס מתנדב:", err)
    }
  }

  // ✅ פונקציה לניווט (במקום useRouter)
  const navigateToActiveCalls = () => {
    console.log("🔄 מרענן את הדף הנוכחי...")
    // כבר נמצאים בדף הקריאות הפעילות, פשוט נרענן
    fetchActiveCalls()
  }

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=he`,
      )
      const data = await res.json()
      return data.display_name || "כתובת לא זמינה"
    } catch (err) {
      console.error("❌ שגיאה בקבלת כתובת ממיקום", err)
      return "כתובת לא זמינה"
    }
  }

  useEffect(() => {
    console.log("🔄 רכיב נטען, volunteerId:", volunteerId)

    if (!isNaN(volunteerId)) {
      fetchActiveCalls()
    } else {
      console.error("❌ volunteerId לא תקין")
      // במקום router.push, פשוט הצג הודעה
      alert("אנא התחבר מחדש למערכת")
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("📍 מיקום התקבל:", pos.coords.latitude, pos.coords.longitude)
        setCoords({ x: pos.coords.latitude, y: pos.coords.longitude })
      },
      (err) => {
        console.error("❌ לא הצלחנו לקבל מיקום", err)
      },
    )
  }, [volunteerId])

  useEffect(() => {
    if (!coords || isNaN(volunteerId)) {
      return
    }

    console.log("🔄 מתחיל לחפש קריאות חדשות...")

    const interval = setInterval(async () => {
      try {
        const res = await getNearbyCalls(volunteerId)
        if (res.data.length > 0) {
          const newCall = res.data[0]

          const alreadyActive = activeCalls.some((call) => call.id === newCall.id)

          if (!alreadyActive && !modalCall) {
            console.log("🚨 קריאה חדשה נמצאה:", newCall.id)
            const addr = await reverseGeocode(newCall.locationX, newCall.locationY)
            setAddress(addr)
            setModalCall(newCall)
          }
        }
      } catch (err) {
        console.error("❌ שגיאה בחיפוש קריאות חדשות:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [coords, activeCalls, volunteerId, modalCall])

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
          setModalCall(null)
          setAddress(null)
        }}
        onNavigateToActiveCalls={navigateToActiveCalls} // ✅ העברת הפונקציה
      />

      {activeCalls.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>🔍 אין קריאות פעילות כרגע</p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>המערכת מחפשת קריאות חדשות באזור שלך...</p>
        </div>
      )}

      {activeCalls.map((call) => (
        <ActiveCallCard key={call.id} call={call} onStatusUpdate={updateVolunteerStatus} />
      ))}
    </BackgroundLayout>
  )
}
