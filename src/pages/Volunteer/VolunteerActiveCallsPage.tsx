"use client"

import { useEffect, useState } from "react"
import ActiveCallCard from "../../components/ActiveCallCard"
import BackgroundLayout from "../../layouts/BackgroundLayout"
import { getActiveCalls, updateVolunteerStatus as updateStatusService } from "../../services/volunteer.service"

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<any[]>([])

  const volunteerIdRaw = localStorage.getItem("volunteerId")
  const volunteerId = volunteerIdRaw ? Number(volunteerIdRaw) : Number.NaN

  const fetchActiveCalls = async () => {
    if (isNaN(volunteerId)) {
      console.warn("⚠️ volunteerId לא תקין")
      return
    }

    try {
      console.log("🔄 טוען קריאות פעילות למתנדב:", volunteerId)
      const res = await getActiveCalls(volunteerId)
      console.log("✅ קריאות פעילות נטענו:", res.data)
      setActiveCalls(res.data)
    } catch (err) {
      const error = err as any
      console.error("❌ שגיאה בטעינת קריאות פעילות:", error)
      setActiveCalls([])
    }
  }

  const updateVolunteerStatus = async (callId: number, newStatus: string, summary?: string) => {
    try {
      console.log("🔄 מעדכן סטטוס מתנדב:", callId, newStatus)

      await updateStatusService(callId, volunteerId, newStatus)

      console.log("✅ סטטוס מתנדב עודכן")

      if (newStatus === "finished") {
        setActiveCalls((prev) => prev.filter((call) => call.id !== callId))
      } else {
        setActiveCalls((prev) =>
          prev.map((call) => (call.id === callId ? { ...call, volunteerStatus: newStatus } : call)),
        )
      }
    } catch (err) {
      const error = err as any
      console.error("❌ שגיאה בעדכון סטטוס מתנדב:", error)
    }
  }

  useEffect(() => {
    console.log("🔄 רכיב נטען, volunteerId:", volunteerId)

    if (!isNaN(volunteerId)) {
      fetchActiveCalls()
    } else {
      console.error("❌ volunteerId לא תקין")
      alert("אנא התחבר מחדש למערכת")
    }
  }, [volunteerId])

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

        <button
          onClick={() => {
            console.log("🚨 [DEBUG] volunteerId:", volunteerId)
            console.log("🚨 [DEBUG] activeCalls:", activeCalls)
          }}
          className="btn btn-warning"
          style={{ margin: "0.5rem auto", display: "block" }}
        >
          🔍 הצג מידע דיבוג
        </button>
      </div>

      {activeCalls.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>🔍 אין קריאות פעילות כרגע</p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            הקריאות שתקבל יופיעו כאן אחרי שתלחץ "אני יוצא"
          </p>
        </div>
      )}

      {activeCalls.map((call) => (
        <ActiveCallCard key={call.id} call={call} onStatusUpdate={updateVolunteerStatus} />
      ))}
    </BackgroundLayout>
  )
}
