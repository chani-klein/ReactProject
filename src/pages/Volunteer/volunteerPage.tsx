"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import BackgroundLayout from "../../layouts/BackgroundLayout"
import AlertModal from "../../components/AlertModal"
import {
  getNearbyCalls,
  respondToCall,
  getVolunteerDetails,
} from "../../services/volunteer.service"

export default function VolunteerMenu() {
  const [modalCall, setModalCall] = useState<any | null>(null)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [volunteerId, setVolunteerId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // חילוץ id מהטוקן JWT
  const extractVolunteerIdFromToken = (token: string): number | null => {
    try {
      const parts = token.split(".")
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        const possibleFields = ["volunteerId", "volunteer_id", "userId", "user_id", "id", "sub"]
        for (const field of possibleFields) {
          if (payload[field] && !isNaN(Number(payload[field]))) {
            return Number(payload[field])
          }
        }
      }
    } catch (error) {
      console.error("❌ שגיאה בחילוץ נתונים מהטוקן:", error)
    }
    return null
  }

  // קבלת ה-id של המתנדב
  const getVolunteerId = async (): Promise<number | null> => {
    const possibilities = ["volunteerId", "volunteer_id", "userId", "user_id", "id"]
    for (const key of possibilities) {
      const value = localStorage.getItem(key)
      if (value && !isNaN(Number(value))) {
        return Number(value)
      }
    }

    const token = localStorage.getItem("token")
    if (token) {
      const idFromToken = extractVolunteerIdFromToken(token)
      if (idFromToken) {
        localStorage.setItem("volunteerId", idFromToken.toString())
        return idFromToken
      }
    }

    const idFromServer = await getVolunteerDetails()
    if (idFromServer) {
      localStorage.setItem("volunteerId", idFromServer.toString())
      return idFromServer
    }

    return null
  }

  // בדיקת טוקן תקף
  const checkAuthToken = (): boolean => {
    const token = localStorage.getItem("token")
    return !!token
  }

  // מתנדב מאשר יציאה לקריאה
  const acceptCall = async () => {
    if (!modalCall || !volunteerId) {
      alert("שגיאה: חסרים נתונים לקבלת הקריאה")
      return
    }

    try {
      await respondToCall({
        callId: modalCall.id,
        volunteerId: volunteerId,
        response: "going",
      })

      // סוגר את המודל ומנקה כתובת
      setModalCall(null)
      setAddress(null)

      // ניווט לקריאות פעילות
      navigate("/volunteer/active-calls")
    } catch (err) {
      const error = err as any
      alert(`שגיאה בקבלת קריאה: ${error.response?.data?.message || error.message}`)
    }
  }

  // מתנדב מסרב לקריאה
  const declineCall = async () => {
    if (!modalCall || !volunteerId) {
      return
    }

    try {
      await respondToCall({
        callId: modalCall.id,
        volunteerId: volunteerId,
        response: "cant", // תיקון: סירוב קריאה
      })

      // סוגר את המודל ומנקה כתובת
      setModalCall(null)
      setAddress(null)
    } catch (err) {
      console.error("❌ שגיאה בסירוב קריאה:", err)
    }
  }

  // הפיכת קואורדינטות לכתובת (Reverse Geocoding)
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=he`,
      )
      const data = await res.json()
      return data.display_name || "כתובת לא זמינה"
    } catch (err) {
      return "כתובת לא זמינה"
    }
  }

  // אתחול: בדיקת טוקן, קבלת volunteerId, קבלת מיקום
  useEffect(() => {
    const initializeApp = async () => {
      if (!checkAuthToken()) {
        navigate("/login")
        return
      }

      const id = await getVolunteerId()
      if (!id) {
        navigate("/login")
        return
      }

      setVolunteerId(id)
      setIsLoading(false)

      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ x: pos.coords.latitude, y: pos.coords.longitude }),
        () => setCoords({ x: 32.0853, y: 34.7818 }), // תל אביב ברירת מחדל
      )
    }

    initializeApp()
  }, [navigate])

  // בדיקת קריאות קרובות כל 5 שניות
  useEffect(() => {
    if (!coords || !volunteerId || isLoading) return

    const interval = setInterval(async () => {
      try {
        const res = await getNearbyCalls(volunteerId)

        // אם יש קריאה חדשה ועדיין אין מודל מוצג
        if (res.data.length > 0 && !modalCall) {
          const newCall = res.data[0]
          const addr = await reverseGeocode(newCall.locationX, newCall.locationY)
          setAddress(addr)
          setModalCall(newCall)
        }
      } catch (err) {
        console.error("❌ שגיאה בחיפוש קריאות:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [coords, volunteerId, modalCall, isLoading])

  if (isLoading) {
    return (
      <BackgroundLayout>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>🔄 טוען...</h2>
          <p>מאתחל מערכת מתנדבים</p>
        </div>
      </BackgroundLayout>
    )
  }

  return (
    <BackgroundLayout>
      <div className="volunteer-menu-container">
        <h1 className="menu-title">תפריט מתנדב</h1>

        <div
          style={{ textAlign: "center", marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}
        >
          מתנדב #{volunteerId} | מיקום:{" "}
          {coords ? `${coords.x.toFixed(4)}, ${coords.y.toFixed(4)}` : "טוען..."}
        </div>

        <div className="menu-grid">
          <Link to="/volunteer/active-calls" className="menu-card">
            <div className="card-icon">📡</div>
            <div className="card-title">קריאות פעילות</div>
            <div className="card-subtitle">צפה בקריאות חירום פעילות</div>
          </Link>

          <Link to="/volunteer/history" className="menu-card">
            <div className="card-icon">📖</div>
            <div className="card-title">היסטוריית קריאות</div>
            <div className="card-subtitle">עיין בקריאות קודמות</div>
          </Link>

          <Link to="/volunteer/update-details" className="menu-card">
            <div className="card-icon">⚙️</div>
            <div className="card-title">עדכון פרטים אישיים</div>
            <div className="card-subtitle">עדכן את הפרטים שלך</div>
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => {
              console.log("🚨 volunteerId:", volunteerId)
              console.log("🚨 coords:", coords)
              console.log("🚨 modalCall:", modalCall)
              console.log("🚨 isLoading:", isLoading)
            }}
            className="btn btn-warning"
            style={{ padding: "0.5rem 1rem" }}
          >
            🔍 הצג מידע דיבוג
          </button>
        </div>
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
      />
    </BackgroundLayout>
  )
}
