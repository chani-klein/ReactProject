"use client"

import { useState } from "react"
import type { Call } from "../types/call.types"

interface AlertModalProps {
  isOpen: boolean
  call: Call | null
  address: string | null
  onAccept: () => Promise<void>
  onDecline: () => Promise<void>
  onClose: () => void
  onNavigateToActiveCalls?: () => void // ✅ הוספתי callback לניווט
}

export default function AlertModal({
  isOpen,
  call,
  address,
  onAccept,
  onDecline,
  onClose,
  onNavigateToActiveCalls,
}: AlertModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAccept = async () => {
    console.log("מתחיל לטפל בקבלת הקריאה...")
    setIsProcessing(true)
    try {
      await onAccept()
      console.log("קריאה התקבלה בהצלחה, מעביר לדף קריאות פעילות...")

      // ✅ השתמש בcallback במקום useRouter
      if (onNavigateToActiveCalls) {
        onNavigateToActiveCalls()
      }
    } catch (error) {
      console.error("שגיאה בקבלת הקריאה:", error)
      alert("שגיאה בקבלת הקריאה. אנא נסה שוב.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecline = async () => {
    console.log("מסרב לקריאה...")
    setIsProcessing(true)
    try {
      await onDecline()
      console.log("סירוב נשמר בהצלחה")
    } catch (error) {
      console.error("שגיאה בסירוב הקריאה:", error)
      alert("שגיאה בסירוב הקריאה. אנא נסה שוב.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen || !call) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">🚨</div>
          <h2 className="modal-title">קריאה חדשה באזור שלך!</h2>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <p>
              <strong>📝 תיאור:</strong> {call.description}
            </p>
            <p>
              <strong>🚨 דחיפות:</strong> {call.urgencyLevel}
            </p>
            <p>
              <strong>📍 כתובת:</strong> {address || `${call.locationX}, ${call.locationY}`}
            </p>
            <p>
              <strong>⏰ זמן:</strong> {new Date(call.createdAt).toLocaleString("he-IL")}
            </p>
          </div>

          <div className="modal-warning">⚠️ לחיצה על "אני יוצא" תעביר אותך לקריאות הפעילות</div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-success" onClick={handleAccept} disabled={isProcessing}>
            {isProcessing ? "🔄 מעבד..." : "🚑 אני יוצא"}
          </button>
          <button className="btn btn-danger" onClick={handleDecline} disabled={isProcessing}>
            {isProcessing ? "🔄 מעבד..." : "❌ לא יכול"}
          </button>
        </div>
      </div>
    </div>
  )
}
