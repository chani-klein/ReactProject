"use client"

import { useState } from "react"
import type { Call } from "../types/call.types"
import CloseCallForm from "./CloseCallForm"

interface ActiveCallCardProps {
  call: Call & { volunteerStatus?: string }
  onStatusUpdate: (id: number, status: string, summary?: string) => void
}

export default function ActiveCallCard({ call, onStatusUpdate }: ActiveCallCardProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [showCloseForm, setShowCloseForm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "קריטי":
        return "danger"
      case "גבוה":
        return "warning"
      case "בינוני":
        return "primary"
      default:
        return "success"
    }
  }

  const getVolunteerStatusDisplay = (status: string) => {
    switch (status) {
      case "going":
        return { text: "בדרך למקום", class: "on-way", icon: "🚗" }
      case "arrived":
        return { text: "הגעתי למקום", class: "arrived", icon: "📍" }
      default:
        return { text: "לא ידוע", class: "pending", icon: "❓" }
    }
  }

  const navigateToLocation = async (lat: number, lon: number) => {
    setIsNavigating(true)
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const wazeURL = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`
      const gmapsURL = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`

      window.open(isMobile ? wazeURL : gmapsURL, "_blank")

      setTimeout(() => setIsNavigating(false), 1000)
    } catch (error) {
      console.error("Navigation error:", error)
      setIsNavigating(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(call.id, newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFinishCall = async (summary: string) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(call.id, "finished", summary)
      setShowCloseForm(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const statusInfo = getVolunteerStatusDisplay(call.volunteerStatus || "going")

  if (showCloseForm) {
    return (
      <div className="call-card">
        <CloseCallForm onSubmit={handleFinishCall} isLoading={isUpdating} />
        <button className="btn btn-secondary" onClick={() => setShowCloseForm(false)} disabled={isUpdating}>
          ← חזור
        </button>
      </div>
    )
  }

  return (
    <div className={`call-card status-${statusInfo.class}`}>
      <div className="call-header">
        <div className="call-info">
          <div className="call-icon">🚨</div>
          <div className="call-details">
            <h3>קריאה #{call.id}</h3>
            <p>נוצר: {new Date(call.createdAt).toLocaleString("he-IL")}</p>
          </div>
        </div>
        <div className={`call-status ${statusInfo.class}`}>
          {statusInfo.icon} {statusInfo.text}
        </div>
      </div>

      <div className="call-description">
        <strong>תיאור:</strong> {call.description}
      </div>

      <div className="call-location">
        📍 מיקום: ({call.locationX.toFixed(4)}, {call.locationY.toFixed(4)})
      </div>

      <div className={`call-urgency ${getUrgencyColor(call.urgencyLevel || "")}`}>🚨 דחיפות: {call.urgencyLevel}</div>

      <div className="actions">
        {call.volunteerStatus === "going" && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => navigateToLocation(call.locationX, call.locationY)}
              disabled={isNavigating || isUpdating}
            >
              {isNavigating ? "🔄 פותח ניווט..." : "🗺️ ניווט"}
            </button>
            <button className="btn btn-success" onClick={() => handleStatusUpdate("arrived")} disabled={isUpdating}>
              {isUpdating ? "🔄 מעדכן..." : "📍 הגעתי"}
            </button>
          </>
        )}

        {call.volunteerStatus === "arrived" && (
          <button className="btn btn-danger" onClick={() => setShowCloseForm(true)} disabled={isUpdating}>
            ✅ סיים קריאה
          </button>
        )}
      </div>
    </div>
  )
}
