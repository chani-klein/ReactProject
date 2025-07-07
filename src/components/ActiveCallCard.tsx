'use client';
import { useState, useEffect } from 'react';
import CloseCallForm from './CloseCallForm';
import { updateVolunteerStatus, completeCall, getCallVolunteersInfo } from '../services/volunteer.service';
import { getVolunteerDetails } from '../services/volunteer.service';
import { getAddressFromCoords } from '../services/firstAid.service';
import type { Call, VolunteerStatus } from '../types/call.types';

interface ActiveCallCardProps {
  call: Call;
  onStatusUpdate: (callId: number, newStatus: 'going' | 'arrived' | 'finished', summary?: string) => void;
}

export default function ActiveCallCard({ call, onStatusUpdate }: ActiveCallCardProps) {
  const [address, setAddress] = useState<string>('');
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<string>('going');
  const [goingVolunteersCount, setGoingVolunteersCount] = useState<number>(call.goingVolunteersCount || 0);

  useEffect(() => {
    if (!call.id) return;
    if (call.locationX && call.locationY) {
      getAddressFromCoords(call.locationY, call.locationX)
        .then(setAddress)
        .catch(() => setAddress('כתובת לא זמינה'));
    } else {
      setAddress('כתובת לא זמינה');
    }

    const fetchGoingCount = async () => {
      try {
        const info = await getCallVolunteersInfo(call.id);
        setGoingVolunteersCount(info.data.goingVolunteersCount);
      } catch (err) {
        console.error('שגיאה בשליפת מידע קריאה:', err);
      }
    };
    fetchGoingCount();
  }, [call]);

  useEffect(() => {
    const fetchVolunteerStatus = async () => {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) return;

      const statusObj = call.volunteersStatus?.find((v: VolunteerStatus) => v.volunteerId === volunteerId);
      if (statusObj) {
        setVolunteerStatus(statusObj.response);
      }
    };
    fetchVolunteerStatus();
  }, [call.volunteersStatus]);

  const handleStatusUpdate = async (newStatus: 'going' | 'arrived' | 'finished') => {
    setIsLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      await onStatusUpdate(call.id, newStatus);
      setVolunteerStatus(newStatus);
    } catch (error) {
      console.error('שגיאה בעדכון סטטוס:', error);
      alert('שגיאה בעדכון הסטטוס, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteCall = async (summary: string) => {
    setIsLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      await completeCall(call.id, summary);
      await onStatusUpdate(call.id, 'finished', summary);
      setShowCloseForm(false);
    } catch (error) {
      console.error('שגיאה בסיום קריאה:', error);
      alert('שגיאה בסיום הקריאה, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (volunteerStatus) {
      case 'going':
        return { text: '🚗 בדרך', color: '#ff9800' };
      case 'arrived':
        return { text: '🎯 הגעתי', color: '#4caf50' };
      case 'finished':
        return { text: '✅ הושלם', color: '#8bc34a' };
      default:
        return { text: '🚗 בדרך', color: '#ff9800' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="card-header">
        <h3 style={{ margin: 0 }}>{call.description}</h3>
        <span
          style={{
            backgroundColor: statusDisplay.color,
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
          }}
        >
          {statusDisplay.text}
        </span>
      </div>

      <div className="card-body">
        <p><strong>🚨 דחיפות:</strong> {call.urgencyLevel ?? "לא זמין"}</p>
        <p><strong>📍 כתובת:</strong> {address || "לא זמין"}</p>
        <p><strong>⏰ זמן:</strong> {call.createdAt ? new Date(call.createdAt).toLocaleString('he-IL') : "לא זמין"}</p>
        <p><strong>🚗 מתנדבים בדרך:</strong> {goingVolunteersCount ?? 0}</p>
        {call.imageUrl && (
          <div style={{ margin: '1rem 0' }}>
            <img src={call.imageUrl} alt="תמונת הקריאה" style={{ maxWidth: '200px', borderRadius: '4px' }} />
          </div>
        )}
      </div>

      <div className="card-actions">
        {volunteerStatus === 'going' && (
          <button
            className="btn btn-success"
            onClick={() => handleStatusUpdate('arrived')}
            disabled={isLoading}
          >
            {isLoading ? '🔄 מעדכן...' : '🎯 הגעתי'}
          </button>
        )}

        {volunteerStatus === 'arrived' && (
          <button
            className="btn btn-warning"
            onClick={() => setShowCloseForm(true)}
            disabled={isLoading}
          >
            {isLoading ? '🔄 מעדכן...' : '✅ סיום קריאה'}
          </button>
        )}

        {showCloseForm && (
          <div style={{ marginTop: '1rem' }}>
            <CloseCallForm onSubmit={handleCompleteCall} isLoading={isLoading} />
            <button
              className="btn btn-secondary"
              onClick={() => setShowCloseForm(false)}
              style={{ marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              ❌ ביטול
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// "use client"

// import { useState } from "react"
// import type { Call } from "../types/call.types"
// import { Clock, MapPin, AlertTriangle, User } from "lucide-react"
// import { getVolunteerDetails } from "../Utils/getVolunteerDetails"

// interface ActiveCallCardProps {
//   call: Call
//   onStatusUpdate: (callId: number, status: "going" | "arrived" | "finished", summary?: string) => Promise<void>
//   onCompleteCall: (callId: number, summary: string) => Promise<void>
// }

// export default function ActiveCallCard({ call, onStatusUpdate, onCompleteCall }: ActiveCallCardProps) {
//   const [showSummaryForm, setShowSummaryForm] = useState(false)
//   const [summary, setSummary] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [showCloseForm, setShowCloseForm] = useState(false) // Declare setShowCloseForm

//   const handleStatusUpdate = async (newStatus: "going" | "arrived" | "finished") => {
//     setIsLoading(true)
//     try {
//       const volunteerId = getVolunteerDetails()
//       if (!volunteerId) throw new Error("מתנדב לא מזוהה")

//       await onStatusUpdate(call.id, newStatus)
//     } catch (error) {
//       console.error("שגיאה בעדכון סטטוס:", error)
//       alert("שגיאה בעדכון הסטטוס, נסה שוב")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCompleteCallClick = async () => {
//     if (!summary.trim()) {
//       alert("אנא הזן סיכום הקריאה")
//       return
//     }

//     setIsLoading(true)
//     try {
//       const volunteerId = getVolunteerDetails()
//       if (!volunteerId) throw new Error("מתנדב לא מזוהה")

//       await onCompleteCall(call.id, summary)
//       setShowCloseForm(false)
//       setShowSummaryForm(false)
//       setSummary("")
//     } catch (error) {
//       console.error("שגיאה בסיום קריאה:", error)
//       alert("שגיאה בסיום הקריאה, נסה שוב")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getUrgencyColor = (urgency: number) => {
//     switch (urgency) {
//       case 1: // נמוכה
//         return "var(--success-green)"
//       case 2: // בינוני
//         return "var(--warning-orange)"
//       case 3: // גבוהה
//       case 4: // קריטית
//         return "var(--emergency-red)"
//       default:
//         return "var(--text-gray)"
//     }
//   }

//   const getUrgencyText = (urgency: number) => {
//     switch (urgency) {
//       case 1:
//         return "נמוכה"
//       case 2:
//         return "בינוני"
//       case 3:
//         return "גבוהה"
//       case 4:
//         return "קריטית"
//       default:
//         return "לא ידוע"
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "Open":
//         return "פתוחה"
//       case "InProgress":
//         return "בטיפול"
//       case "Closed":
//         return "סגורה"
//       default:
//         return status
//     }
//   }

//   return (
//     <div className="active-call-card">
//       <div className="call-header">
//         <div className="call-title">
//           <AlertTriangle size={20} />
//           <h3>קריאה #{call.id}</h3>
//         </div>
//         <div className="call-badges">
//           <span className="status-badge" style={{ backgroundColor: getUrgencyColor(call.urgencyLevel) }}>
//             {getUrgencyText(call.urgencyLevel)}
//           </span>
//           <span className="status-badge status-secondary">{getStatusText(call.status)}</span>
//         </div>
//       </div>

//       <div className="call-content">
//         <div className="call-description">
//           <p>{call.description}</p>
//         </div>

//         <div className="call-meta">
//           <div className="meta-item">
//             <Clock size={16} />
//             <span>{new Date(call.createdAt).toLocaleString("he-IL")}</span>
//           </div>
//           <div className="meta-item">
//             <MapPin size={16} />
//             <span>
//               {call.locationY.toFixed(4)}, {call.locationX.toFixed(4)}
//             </span>
//           </div>
//           {call.goingVolunteersCount && (
//             <div className="meta-item">
//               <User size={16} />
//               <span>{call.goingVolunteersCount} מתנדבים מגיבים</span>
//             </div>
//           )}
//         </div>

//         {call.imageUrl && (
//           <div className="call-image">
//             <img src={call.imageUrl || "/placeholder.svg"} alt="תמונת הקריאה" />
//           </div>
//         )}
//       </div>

//       {!showSummaryForm ? (
//         <div className="call-actions">
//           <button className="action-btn going-btn" onClick={() => handleStatusUpdate("going")} disabled={isLoading}>
//             {isLoading ? "מעדכן..." : "בדרך"}
//           </button>
//           <button className="action-btn arrived-btn" onClick={() => handleStatusUpdate("arrived")} disabled={isLoading}>
//             {isLoading ? "מעדכן..." : "הגעתי"}
//           </button>
//           <button className="action-btn finished-btn" onClick={() => setShowSummaryForm(true)} disabled={isLoading}>
//             סיים קריאה
//           </button>
//         </div>
//       ) : (
//         <div className="summary-form">
//           <h4>סיכום הקריאה</h4>
//           <textarea
//             value={summary}
//             onChange={(e) => setSummary(e.target.value)}
//             placeholder="תאר מה נעשה בקריאה, האם נדרשה פינוי לבית חולים וכו'..."
//             rows={4}
//             className="summary-textarea"
//           />
//           <div className="summary-actions">
//             <button className="action-btn complete-btn" onClick={handleCompleteCallClick} disabled={isLoading}>
//               {isLoading ? "מסיים..." : "סיים קריאה"}
//             </button>
//             <button
//               className="action-btn cancel-btn"
//               onClick={() => {
//                 setShowSummaryForm(false)
//                 setSummary("")
//               }}
//               disabled={isLoading}
//             >
//               ביטול
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
