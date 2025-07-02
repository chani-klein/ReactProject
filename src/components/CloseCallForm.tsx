"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, X } from "lucide-react"

interface CloseCallFormProps {
  call: { id: number; description?: string }
  onComplete: (callId: number, summary: string) => Promise<void>
}

export default function CloseCallForm({ call, onComplete }: CloseCallFormProps) {
  const [summary, setSummary] = useState("")
  const [sentToHospital, setSentToHospital] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!summary.trim()) {
      alert("אנא הזן סיכום הקריאה")
      return
    }

    setIsSubmitting(true)
    try {
      const fullSummary = sentToHospital ? `${summary} | פונה לבית חולים: כן` : summary
      await onComplete(call.id, fullSummary)
      setShowForm(false)
      setSummary("")
      setSentToHospital(false)
    } catch (error) {
      console.error("שגיאה בסיום קריאה:", error)
      alert("שגיאה בסיום הקריאה")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showForm) {
    return (
      <div className="close-call-trigger">
        <button className="complete-call-btn" onClick={() => setShowForm(true)}>
          <CheckCircle size={20} />
          סיים קריאה
        </button>
      </div>
    )
  }

  return (
    <div className="close-call-form">
      <div className="form-header">
        <h3>סיום קריאה #{call.id}</h3>
        <button className="close-form-btn" onClick={() => setShowForm(false)}>
          <X size={20} />
        </button>
      </div>

      {call.description && (
        <div className="call-reminder">
          <p>
            <strong>תיאור הקריאה:</strong> {call.description}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="summary-form">
        <div className="form-group">
          <label htmlFor="summary">סיכום הטיפול *</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="תאר מה נעשה בקריאה, מצב הנפגע, טיפול שניתן וכו'..."
            rows={5}
            className="form-textarea"
            required
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sentToHospital}
              onChange={(e) => setSentToHospital(e.target.checked)}
              className="form-checkbox"
            />
            <span className="checkbox-text">הנפגע פונה לבית חולים</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? "מסיים קריאה..." : "סיים קריאה"}
          </button>
          <button type="button" onClick={() => setShowForm(false)} disabled={isSubmitting} className="cancel-btn">
            ביטול
          </button>
        </div>
      </form>
    </div>
  )
}
