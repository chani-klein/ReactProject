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
}

export default function AlertModal({ isOpen, call, address, onAccept, onDecline, onClose }: AlertModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAccept = async () => {
    console.log("🚨 [DEBUG] לחיצה על כפתור 'אני יוצא'")
    setIsProcessing(true)

    try {
      console.log("🚨 [DEBUG] מתחיל לקרוא ל-onAccept()...")
      await onAccept()
      console.log("🚨 [DEBUG] onAccept() הושלם בהצלחה!")
    } catch (error) {
      const err = error as any
      console.error("🚨 [ERROR] שגיאה בקבלת הקריאה:", err)
      alert(`שגיאה בקבלת הקריאה: ${err}`)
    } finally {
      console.log("🚨 [DEBUG] מסיים - מגדיר isProcessing ל-false")
      setIsProcessing(false)
    }
  }

  const handleDecline = async () => {
    console.log("🚨 [DEBUG] לחיצה על כפתור 'לא יכול'")
    setIsProcessing(true)
    try {
      await onDecline()
      console.log("🚨 [DEBUG] סירוב נשמר בהצלחה")
    } catch (error) {
      const err = error as any
      console.error("🚨 [ERROR] שגיאה בסירוב הקריאה:", err)
      alert(`שגיאה בסירוב הקריאה: ${err}`)
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
