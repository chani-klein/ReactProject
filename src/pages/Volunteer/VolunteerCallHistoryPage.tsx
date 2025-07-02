// 'use client';
// import { useState, useEffect } from 'react';
// import BackgroundLayout from '../../layouts/BackgroundLayout';
// import CloseCallForm from '../../components/CloseCallForm';
// import { getVolunteerHistory, completeCall } from '../../services/volunteer.service';
// import { getVolunteerDetails } from '../../services/volunteer.service';
// import type { Call } from '../../types/call.types';
// export default function HistoryPage() {
//   const [calls, setCalls] = useState<Call[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCalls = async () => {
//     setLoading(true);
//     try {
//       const volunteerId = await getVolunteerDetails();
//       if (!volunteerId) throw new Error('מתנדב לא מזוהה');
//       const res = await getVolunteerHistory(volunteerId);
//       setCalls(res.data);
//     } catch (error) {
//       console.error('Error fetching calls:', error);
//       alert('שגיאה בטעינת היסטוריית קריאות');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeCall = async (id: number, summary: string) => {
//     try {
//       await completeCall(id, summary);
//       await fetchCalls();
//     } catch (error) {
//       console.error('Error closing call:', error);
//       alert('שגיאה בסיום הקריאה, נסה שוב');
//     }
//   };

//   useEffect(() => {
//     fetchCalls();
//   }, []);

//   return (
//     <BackgroundLayout>
//       <h2>📖 היסטוריית קריאות</h2>
//       {loading && <p>טוען...</p>}
//       {!loading && calls.length === 0 && <p>אין קריאות להצגה.</p>}
//       {calls.map((call) => (
//         <div key={call.id} className="card">
//           <h3>{call.description}</h3>
//           <p>סטטוס: {call.status}</p>
//           {call.status === 'Closed' ? (
//             <p>📝 דו״ח: {call.summary || 'לא נרשם דו"ח'}</p>
//           ) : (
//             <CloseCallForm onSubmit={(summary) => closeCall(call.id, summary)} />
//           )}
//         </div>
//       ))}
//     </BackgroundLayout>
//   );
// }
"use client"
import { useState, useEffect } from "react"
import BackgroundLayout from "../../layouts/BackgroundLayout"
import CloseCallForm from "../../components/CloseCallForm"
import { getVolunteerHistory, completeCall } from "../../services/volunteer.service"
import { getVolunteerDetails } from "../../services/volunteer.service"
import type { Call } from "../../types/call.types"

export default function VolunteerCallHistoryPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCallHistory()
  }, [])

  const loadCallHistory = async () => {
    setIsLoading(true)
    try {
      const volunteerId = await getVolunteerDetails()
      if (!volunteerId) throw new Error("מתנדב לא מזוהה")

      // 🔧 תיקון: הסרת הפרמטר volunteerId
      const res = await getVolunteerHistory()
      setCalls(res.data)
    } catch (error) {
      console.error("Error fetching calls:", error)
      setError("שגיאה בטעינת היסטוריית הקריאות")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteCall = async (callId: number, summary: string) => {
    try {
      await completeCall(callId, summary)
      await loadCallHistory() // רענון הרשימה
    } catch (err) {
      console.error("❌ שגיאה בסיום קריאה:", err)
      alert("שגיאה בסיום הקריאה")
    }
  }

  const getUrgencyText = (urgency: number) => {
    switch (urgency) {
      case 1:
        return "נמוכה"
      case 2:
        return "בינוני"
      case 3:
        return "גבוהה"
      case 4:
        return "קריטית"
      default:
        return "לא ידוע"
    }
  }

  if (isLoading) {
    return (
      <BackgroundLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>טוען היסטוריית קריאות...</p>
        </div>
      </BackgroundLayout>
    )
  }

  if (error) {
    return (
      <BackgroundLayout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadCallHistory} className="retry-button">
            נסה שוב
          </button>
        </div>
      </BackgroundLayout>
    )
  }

  return (
    <BackgroundLayout>
      <div className="volunteer-history-page">
        <h1>היסטוריית קריאות</h1>

        {calls.length === 0 ? (
          <div className="no-calls">
            <p>אין היסטוריית קריאות</p>
          </div>
        ) : (
          <div className="calls-list">
            {calls.map((call) => (
              <div key={call.id} className="call-card">
                <div className="call-header">
                  <h3>קריאה #{call.id}</h3>
                  <span className={`status-badge status-${call.status.toLowerCase()}`}>{call.status}</span>
                </div>

                <div className="call-details">
                  <p>
                    <strong>תיאור:</strong> {call.description}
                  </p>
                  <p>
                    <strong>רמת דחיפות:</strong> {getUrgencyText(call.urgencyLevel)}
                  </p>
                  <p>
                    <strong>תאריך יצירה:</strong> {new Date(call.createdAt).toLocaleString("he-IL")}
                  </p>
                  {call.summary && (
                    <p>
                      <strong>סיכום:</strong> {call.summary}
                    </p>
                  )}
                </div>

                {call.status === "InProgress" && (
                  <CloseCallForm
                    call={{ id: call.id, description: call.description }}
                    onComplete={handleCompleteCall}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </BackgroundLayout>
  )
}
