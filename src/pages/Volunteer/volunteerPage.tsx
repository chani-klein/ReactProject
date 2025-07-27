"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import BackgroundLayout from "../../layouts/BackgroundLayout"
import {  getVolunteerDetails,} from "../../services/volunteer.service"
import { getActiveVolunteerCalls, updateVolunteerStatus, finishVolunteerCall } from "../../services/calls.service"
import { NOTIFICATION_CONFIG } from "../../config/notifications.config"
import { signalRService } from "../../services/signalR.service"
import { useCallContext } from "../../contexts/CallContext"
export default function VolunteerMenu() {
  const [modalCall, setModalCall] = useState<any | null>(null)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [volunteerId, setVolunteerId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { setPopupCall } = useCallContext()

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
    if (!modalCall.id) {
      alert("שגיאה: הקריאה אינה מכילה מזהה (id)")
      return
    }
    try {
      console.log("[DEBUG] acceptCall: modalCall.id=", modalCall.id, "volunteerId=", volunteerId, "status=going")
      await updateVolunteerStatus(modalCall.id, volunteerId, "going")
      setModalCall(null)
      setAddress(null)
      navigate("/volunteer/active-calls")
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        alert("שגיאה בקבלת קריאה: " + JSON.stringify(err.response.data.errors))
        console.error("[ERROR] acceptCall: ", err.response.data.errors)
      } else {
        alert("שגיאה בקבלת קריאה")
        console.error("[ERROR] acceptCall: ", err)
      }
    }
  }

  // מתנדב מסרב לקריאה
  const declineCall = async () => {
    if (!modalCall || !volunteerId) {
      alert("שגיאה: חסרים נתונים לסירוב הקריאה")
      return
    }
    if (!modalCall.id) {
      alert("שגיאה: הקריאה אינה מכילה מזהה (id)")
      return
    }
    try {
      console.log("[DEBUG] declineCall: modalCall.id=", modalCall.id, "volunteerId=", volunteerId, "status=cant")
      await updateVolunteerStatus(modalCall.id, volunteerId, "cant")
      setModalCall(null)
      setAddress(null)
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        alert("שגיאה בסירוב קריאה: " + JSON.stringify(err.response.data.errors))
        console.error("[ERROR] declineCall: ", err.response.data.errors)
      } else {
        alert("שגיאה בסירוב קריאה")
        console.error("[ERROR] declineCall: ", err)
      }
    }
  }

  // מתנדב מעדכן שהגיע למקום
  const arrivedCall = async () => {
    if (!modalCall || !volunteerId) {
      alert("שגיאה: חסרים נתונים לעדכון הגעה")
      return
    }
    if (!modalCall.id) {
      alert("שגיאה: הקריאה אינה מכילה מזהה (id)")
      return
    }
    try {
      console.log("[DEBUG] arrivedCall: modalCall.id=", modalCall.id, "volunteerId=", volunteerId, "status=arrived")
      await updateVolunteerStatus(modalCall.id, volunteerId, "arrived")
      setModalCall(null)
      setAddress(null)
      navigate("/volunteer/active-calls")
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        alert("שגיאה בעדכון הגעה: " + JSON.stringify(err.response.data.errors))
        console.error("[ERROR] arrivedCall: ", err.response.data.errors)
      } else {
        alert("שגיאה בעדכון הגעה")
        console.error("[ERROR] arrivedCall: ", err)
      }
    }
  }

  // מתנדב מסיים טיפול
  const finishCall = async () => {
    if (!modalCall || !modalCall.id) {
      alert("שגיאה: חסרים נתונים לסיום קריאה")
      return
    }
    try {
      console.log("[DEBUG] finishCall: modalCall.id=", modalCall.id, "status=finished")
      const summary = window.prompt("נא להזין סיכום טיפול:")
      if (!summary || summary.trim() === "") {
        alert("סיכום טיפול הוא חובה לסיום קריאה!")
        return
      }
    
      setModalCall(null)
      setAddress(null)
      navigate("/volunteer/active-calls")
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        alert("שגיאה בסיום קריאה: " + JSON.stringify(err.response.data.errors))
        console.error("[ERROR] finishCall: ", err.response.data.errors)
      } else {
        alert("שגיאה בסיום קריאה")
        console.error("[ERROR] finishCall: ", err)
      }
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

  // בדיקת קריאות פעילות כל 2 שניות - DISABLED להשתמש ב-SignalR
  useEffect(() => {
    // השבתת polling בגלל שימוש ב-SignalR
    console.log('🔇 VolunteerPage polling disabled - using SignalR instead');
    return;

    /* DISABLED POLLING CODE - Using SignalR instead
    if (!coords || !volunteerId || isLoading) return

    const interval = setInterval(async () => {
      try {
        // שליפת קריאות פעילות למתנדב בלבד (כולל פרטי קריאה מלאים)
        const activeCalls = await getActiveVolunteerCalls(volunteerId)

        if (activeCalls.length > 0 && !modalCall) {
          let newCall = activeCalls[0];
          // אם אין id (VolunteerCall) – נביא את הקריאה המלאה לפי callsId
          if ((!newCall.id || !newCall.description || !newCall.urgencyLevel) && newCall.callsId) {
            try {
              const { data: fullCall } = await import("../../services/calls.service").then(m => m.getCallById(newCall.callsId));
              newCall = { ...fullCall, ...newCall, id: fullCall.id };
            } catch (err) {
              alert("שגיאה: לא ניתן להביא פרטי קריאה מלאה מהשרת");
              return;
            }
          }
          // בדיקה שהמיקום קיים לפני קריאה ל-reverseGeocode
          let addr = 'כתובת לא זמינה';
          if (
            typeof newCall.locationX === 'number' &&
            typeof newCall.locationY === 'number' &&
            !isNaN(newCall.locationX) &&
            !isNaN(newCall.locationY)
          ) {
            addr = await reverseGeocode(newCall.locationX, newCall.locationY);
          } else if (newCall.address) {
            addr = newCall.address;
          } else if (newCall.locationX && newCall.locationY) {
            addr = `${newCall.locationX}, ${newCall.locationY}`;
          }
          setAddress(addr);
          setModalCall(newCall);
        }
      } catch (err) {
        console.error("❌ שגיאה בחיפוש קריאות:", err)
      }
    }, 2000)

    return () => clearInterval(interval)
    */
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
          {/* כפתור debug לבדיקת SignalR */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={async () => {
                console.log('🔍 בדיקת SignalR...');
                const info = signalRService.getConnectionInfo();
                console.log('📊 מידע חיבור:', info);
                
                if (signalRService.isConnected()) {
                  await signalRService.testConnection();
                  alert('SignalR חיבור פעיל ✅');
                } else {
                  alert('SignalR לא מחובר ❌');
                }
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔍 בדוק SignalR
            </button>

            <button 
              onClick={async () => {
                console.log('🧪 יצירת קריאת חירום אמיתית למבחן...');
                
                try {
                  // יצירת קריאה אמיתית במערכת
                  const testCall = {
                    description: "בדיקה - קריאת חירום למבחן",
                    locationX: 32.0853,
                    locationY: 34.7818,
                    urgencyLevel: 3,
                    callerName: "מבדק מערכת"
                  };

                  // יצירת קריאה דרך ה-API
                  const response = await fetch('https://localhost:7219/api/Calls', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(testCall)
                  });

                  if (response.ok) {
                    const newCall = await response.json();
                    console.log('✅ קריאה אמיתית נוצרה:', newCall);
                    alert('✅ קריאת מבחן נוצרה בהצלחה! המתנדבים יקבלו התראה.');
                  } else {
                    console.error('❌ שגיאה ביצירת קריאה:', await response.text());
                    alert('❌ שגיאה ביצירת קריאת מבחן');
                  }
                } catch (error) {
                  console.error('❌ שגיאה ביצירת קריאה:', error);
                  alert('❌ שגיאה ביצירת קריאת מבחן');
                }
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🧪 צור קריאת מבחן
            </button>
          </div>
        </div>
      </div>

      {/* <AlertModal
        isOpen={!!modalCall}
        call={modalCall}
        address={address}
        onAccept={acceptCall}
        onDecline={declineCall}
        onArrived={arrivedCall}
        onFinish={finishCall}
        onClose={() => {
          setModalCall(null)
          setAddress(null)
        }}
      /> */}
    </BackgroundLayout>
  )
}
// "use client"

// import { useState, useEffect } from "react"
// import { getNearbyCalls, respondToCall } from "../../services/volunteer.service"
// import type { Call } from "../../types/call.types"
// import BackgroundLayout from "../../layouts/BackgroundLayout"

// interface ModalCall extends Call {
//   // הוספת properties נוספים אם נדרש
// }

// const getUrgencyText = (urgency: number) => {
//   switch (urgency) {
//     case 1:
//       return "נמוכה"
//     case 2:
//       return "בינוני"
//     case 3:
//       return "גבוהה"
//     case 4:
//       return "קריטית"
//     default:
//       return "לא ידוע"
//   }
// }

// const getUrgencyClass = (urgency: number) => {
//   switch (urgency) {
//     case 1:
//       return "urgency-low"
//     case 2:
//       return "urgency-medium"
//     case 3:
//       return "urgency-high"
//     case 4:
//       return "urgency-critical"
//     default:
//       return "urgency-unknown"
//   }
// }

// const VolunteerPage = () => {
//   const [calls, setCalls] = useState<Call[]>([])
//   const [modalCall, setModalCall] = useState<ModalCall | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchCalls()
//     // רענון כל 30 שניות
//     const interval = setInterval(fetchCalls, 3000)
//     return () => clearInterval(interval)
//   }, [])

//   const fetchCalls = async () => {
//     try {
//       // 🔧 תיקון: הסרת הפרמטר volunteerId
//       const res = await getNearbyCalls()
//       setCalls(res.data)
//       setError(null)
//     } catch (error) {
//       console.error("Error fetching calls:", error)
//       setError("שגיאה בטעינת קריאות")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRespondToCall = async (response: "going" | "cant") => {
//     if (!modalCall) return

//     try {
//       // 🔧 תיקון: שימוש בפרמטרים הנכונים
//       await respondToCall(modalCall.id, response)
//       setModalCall(null)
//       fetchCalls() // רענון הקריאות
//     } catch (error) {
//       console.error("Error responding to call:", error)
//       alert("שגיאה בתגובה לקריאה")
//     }
//   }

//   if (isLoading) {
//     return (
//       <BackgroundLayout>
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>טוען קריאות קרובות...</p>
//         </div>
//       </BackgroundLayout>
//     )
//   }

//   return (
//     <BackgroundLayout>
//       <div className="volunteer-page">
//         <h1>קריאות קרובות</h1>

//         {error && (
//           <div className="error-message">
//             <p>{error}</p>
//             <button onClick={fetchCalls} className="retry-button">
//               נסה שוב
//             </button>
//           </div>
//         )}

//         {calls.length > 0 ? (
//           <div className="calls-grid">
//             {calls.map((call) => (
//               <div key={call.id} className="call-card">
//                 <div className="call-header">
//                   <h3>קריאה #{call.id}</h3>
//                   <span className={`urgency-badge ${getUrgencyClass(call.urgencyLevel)}`}>
//                     {getUrgencyText(call.urgencyLevel)}
//                   </span>
//                 </div>

//                 <div className="call-details">
//                   <p>
//                     <strong>תיאור:</strong> {call.description}
//                   </p>
//                   <p>
//                     <strong>מיקום:</strong> {call.locationY.toFixed(4)}, {call.locationX.toFixed(4)}
//                   </p>
//                   <p>
//                     <strong>זמן יצירה:</strong> {new Date(call.createdAt).toLocaleString("he-IL")}
//                   </p>
//                 </div>

//                 <div className="call-actions">
//                   <button className="view-details-button" onClick={() => setModalCall(call)}>
//                     צפה בפרטים
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-calls">
//             <p>אין קריאות קרובות כרגע</p>
//           </div>
//         )}

//         {/* מודל פרטי קריאה */}
//         {modalCall && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h2>פרטי קריאה #{modalCall.id}</h2>
//                 <button className="close-button" onClick={() => setModalCall(null)}>
//                   ✕
//                 </button>
//               </div>

//               <div className="modal-body">
//                 <p>
//                   <strong>תיאור:</strong> {modalCall.description}
//                 </p>
//                 <p>
//                   <strong>רמת דחיפות:</strong> {getUrgencyText(modalCall.urgencyLevel)}
//                 </p>
//                 <p>
//                   <strong>מיקום:</strong> {modalCall.locationY.toFixed(4)}, {modalCall.locationX.toFixed(4)}
//                 </p>
//                 <p>
//                   <strong>זמן יצירה:</strong> {new Date(modalCall.createdAt).toLocaleString("he-IL")}
//                 </p>
//                 {modalCall.imageUrl && (
//                   <div className="call-image">
//                     <img src={modalCall.imageUrl || "/placeholder.svg"} alt="תמונת הקריאה" />
//                   </div>
//                 )}
//               </div>

//               <div className="modal-actions">
//                 <button className="going-button" onClick={() => handleRespondToCall("going")}>
//                   אני הולך
//                 </button>
//                 <button className="cant-button" onClick={() => handleRespondToCall("cant")}>
//                   לא יכול
//                 </button>
//                 <button className="close-modal-button" onClick={() => setModalCall(null)}>
//                   סגור
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </BackgroundLayout>
//   )
// }

// export default VolunteerPage
