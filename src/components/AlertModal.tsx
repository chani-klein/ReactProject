"use client";
import { useState } from "react";
import type { Call } from "../types/call.types";

interface AlertModalProps {
  isOpen: boolean;
  call: Call | null;
  address: string | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
  onArrived: () => Promise<void>;
  onFinish: () => Promise<void>;
  onClose: () => void;
}

export default function AlertModal({ isOpen, call, address, onAccept, onDecline, onArrived, onFinish, onClose }: AlertModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept();
    } catch (error) {
      alert("שגיאה בקבלת הקריאה");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await onDecline();
    } catch (error) {
      alert("שגיאה בסירוב הקריאה");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !call) return null;

  // קבלת volunteerId מה-localStorage (עם טיפוס תקין)
  let myVolunteerId: number | null = null;
  try {
    const storedId = localStorage.getItem("volunteerId");
    myVolunteerId = storedId !== null && !isNaN(Number(storedId)) ? Number(storedId) : null;
  } catch (e) {
    myVolunteerId = null;
  }
  // הגנה: אם volunteersStatus לא מערך תקין
  const volunteersStatusArr = Array.isArray(call.volunteersStatus) ? call.volunteersStatus : [];
  const myStatus = volunteersStatusArr.find((v: any) => v.volunteerId === myVolunteerId)?.response;

  // הגנה: דחיפות וסטטוס
  const urgencyText = typeof call.urgencyLevel === "number"
    ? ["לא ידוע", "נמוכה", "בינונית", "גבוהה", "קריטית"][call.urgencyLevel] || call.urgencyLevel
    : call.urgencyLevel || "לא ידוע";
  const statusText = call.status === "Open" ? "פתוחה" : call.status === "InProgress" ? "בטיפול" : call.status === "Closed" ? "הושלמה" : call.status || "לא ידוע";

  // הגנה: חישוב כמות מתנדבים בדרך
  const goingCount = volunteersStatusArr.filter((v: any) => v.response === "going").length || call.goingVolunteersCount || 0;

  // הגנה: תאריך
  let createdAtText = "לא זמין";
  if (call.createdAt) {
    try {
      createdAtText = new Date(call.createdAt).toLocaleString("he-IL");
    } catch {}
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">🚨</div>
          <h2 className="modal-title">קריאה חדשה באזור שלך!</h2>
        </div>
        <div className="modal-body">
          <div className="modal-info">
            <p><strong>📝 תיאור:</strong> {call.description || <span style={{color:'red'}}>לא זמינה</span>}</p>
            <p><strong>🚨 דחיפות:</strong> {urgencyText}</p>
            <p><strong>📍 כתובת:</strong> {address || `${call.locationX ?? "?"}, ${call.locationY ?? "?"}`}</p>
            <p><strong>⏰ זמן:</strong> {createdAtText}</p>
            <p><strong>📊 סטטוס קריאה:</strong> {statusText}</p>
            <p><strong>🚑 מתנדבים בדרך:</strong> {goingCount}</p>
            {call.imageUrl && (
              <div style={{marginTop: '1rem'}}>
                <img src={call.imageUrl} alt="תמונה מהאירוע" style={{maxWidth: '100%', maxHeight: 200, borderRadius: 8}} />
              </div>
            )}
          </div>
          <div className="modal-warning">⚠️ לחיצה על "אני יוצא" תעביר אותך לקריאות הפעילות</div>
        </div>
        <div className="modal-actions">
          {/* כפתורי יציאה/ביטול */}
          {(!myStatus || myStatus === "notified" || myStatus === "cant") && (
            <>
              <button className="btn btn-success" onClick={handleAccept} disabled={isProcessing}>
                {isProcessing ? "🔄 מעבד..." : "🚑 אני יוצא"}
              </button>
              <button className="btn btn-danger" onClick={handleDecline} disabled={isProcessing}>
                {isProcessing ? "🔄 מעבד..." : "❌ לא יכול"}
              </button>
            </>
          )}
          {/* כפתור הגעתי */}
          {myStatus === "going" && (
            <button className="btn btn-info" onClick={onArrived} disabled={isProcessing}>
              {isProcessing ? "🔄 מעבד..." : "📍 הגעתי למקום"}
            </button>
          )}
          {/* כפתור סיום טיפול */}
          {myStatus === "arrived" && (
            <button className="btn btn-secondary" onClick={onFinish} disabled={isProcessing}>
              {isProcessing ? "🔄 מעבד..." : "✔️ סיימתי טיפול"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}