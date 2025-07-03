'use client';
import { useEffect, useState } from 'react';
import ActiveCallCard from '../../components/ActiveCallCard';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import { getActiveCalls, updateVolunteerStatus, completeCall } from '../../services/volunteer.service';
import { getVolunteerDetails } from '../../services/volunteer.service';
import type { Call } from '../../types/call.types';

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveCalls = async () => {
    const volunteerId = await getVolunteerDetails();
    if (!volunteerId) {
      console.error('❌ volunteerId לא תקין');
      alert('אנא התחבר מחדש למערכת');
      return;
    }

    setIsLoading(true);
    try {
      const res = await getActiveCalls();
      setActiveCalls(res.data);
    } catch (err) {
      console.error('❌ שגיאה בטעינת קריאות פעילות:', err);
      setActiveCalls([]);
      alert('שגיאה בטעינת קריאות פעילות');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVolunteerStatus = async (callId: number, newStatus: 'going' | 'arrived' | 'finished', summary?: string) => {
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');

      if (newStatus === 'finished') {
        await completeCall(callId, summary || '');
        setActiveCalls((prev) => prev.filter((call) => call.id !== callId));
      } else {
        await updateVolunteerStatus(callId, newStatus);
        setActiveCalls((prev) =>
          prev.map((call) =>
            call.id === callId ? { ...call, volunteersStatus: [{ volunteerId, response: newStatus }] } : call
          )
        );
      }
    } catch (err) {
      console.error('❌ שגיאה בעדכון סטטוס מתנדב:', err);
      alert('שגיאה בעדכון הסטטוס, נסה שוב');
    }
  };

  useEffect(() => {
    fetchActiveCalls();
  }, []);

  return (
    <BackgroundLayout>
      <div className="page-header">
        <h2 style={{ textAlign: 'center' }}>📡 קריאות פעילות</h2>
        <button
          onClick={fetchActiveCalls}
          className="btn btn-secondary"
          style={{ margin: '1rem auto', display: 'block' }}
          disabled={isLoading}
        >
          {isLoading ? '🔄 טוען...' : '🔄 רענן רשימה'}
        </button>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>🔄 טוען קריאות פעילות...</p>
        </div>
      )}

      {!isLoading && activeCalls.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>🔍 אין קריאות פעילות כרגע</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            הקריאות שתקבל יופיעו כאן אחרי שתלחץ "אני יוצא"
          </p>
        </div>
      )}

      {!isLoading &&
        activeCalls.map((call, idx) => (
          <ActiveCallCard key={call.id ?? idx} call={call} onStatusUpdate={updateVolunteerStatus} />
        ))}
    </BackgroundLayout>
  );
}
// "use client"
// import { useState, useEffect } from "react"
// import ActiveCallCard from "../../components/ActiveCallCard"
// import BackgroundLayout from "../../layouts/BackgroundLayout"
// import { getActiveCalls, updateVolunteerStatus, completeCall } from "../../services/volunteer.service"
// import type { Call } from "../../types/call.types"

// export default function VolunteerActiveCallsPage() {
//   const [activeCalls, setActiveCalls] = useState<Call[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     loadActiveCalls()
//   }, [])

//   const loadActiveCalls = async () => {
//     setIsLoading(true)
//     try {
//       // 🔧 תיקון: הסרת הפרמטר volunteerId
//       const res = await getActiveCalls()
//       setActiveCalls(res.data)
//     } catch (err) {
//       console.error("❌ שגיאה בטעינת קריאות פעילות:", err)
//       setError("שגיאה בטעינת קריאות פעילות")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleStatusUpdate = async (callId: number, status: "going" | "arrived" | "finished", summary?: string) => {
//     try {
//       await updateVolunteerStatus(callId, status, summary)
//       await loadActiveCalls() // רענון הרשימה
//     } catch (err) {
//       console.error("❌ שגיאה בעדכון סטטוס:", err)
//       alert("שגיאה בעדכון הסטטוס")
//     }
//   }

//   const handleCompleteCall = async (callId: number, summary: string) => {
//     try {
//       await completeCall(callId, summary)
//       await loadActiveCalls() // רענון הרשימה
//     } catch (err) {
//       console.error("❌ שגיאה בסיום קריאה:", err)
//       alert("שגיאה בסיום הקריאה")
//     }
//   }

//   if (isLoading) {
//     return (
//       <BackgroundLayout>
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>טוען קריאות פעילות...</p>
//         </div>
//       </BackgroundLayout>
//     )
//   }

//   if (error) {
//     return (
//       <BackgroundLayout>
//         <div className="error-container">
//           <p>{error}</p>
//           <button onClick={loadActiveCalls} className="retry-button">
//             נסה שוב
//           </button>
//         </div>
//       </BackgroundLayout>
//     )
//   }

//   return (
//     <BackgroundLayout>
//       <div className="volunteer-active-calls-page">
//         <h1>קריאות פעילות</h1>

//         {activeCalls.length === 0 ? (
//           <div className="no-calls">
//             <p>אין קריאות פעילות כרגע</p>
//           </div>
//         ) : (
//           <div className="calls-grid">
//             {activeCalls.map((call) => (
//               <ActiveCallCard
//                 key={call.id}
//                 call={call}
//                 onStatusUpdate={handleStatusUpdate}
//                 onCompleteCall={handleCompleteCall}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </BackgroundLayout>
//   )
// }
