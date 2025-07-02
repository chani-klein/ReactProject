// CallConfirmationPage.tsx - עמוד אישור קריאה עם עיצוב מודרני
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { getCallStatus } from "../../services/calls.service";
import "../../style/emergency-styles.css"; // יבוא קובץ ה-CSS

export default function CallConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const callId = (location.state as any)?.callId;
  const description = (location.state as any)?.description || "";
  const guidesFromState = (location.state as any)?.guides || [];
  
  const [status, setStatus] = useState("נשלחה");
  const [guides, setGuides] = useState<{ title: string; description: string }[]>(guidesFromState);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);

  // סטטוס הקריאה כל 3 שניות
  useEffect(() => {
    if (!callId) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await getCallStatus(callId);
        setStatus(response.data.status);
      } catch (err) {
        console.error("שגיאה בקבלת סטטוס", err);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [callId]);

  // קריאה להוראות GPT אם אין הוראות מהסטייט
  useEffect(() => {
    const fetchGuideFromAI = async () => {
      if (!description || guides.length > 0) return;
      
      setIsLoadingGuides(true);
      try {
        const res = await axios.post("http://localhost:5000/api/firstaid/ai", description, {
          headers: { "Content-Type": "application/json" },
        });
        setGuides([{ title: "הוראות עזרה ראשונה", description: res.data }]);
      } catch (err) {
        console.error("שגיאה בקבלת הוראות AI", err);
      } finally {
        setIsLoadingGuides(false);
      }
    };

    fetchGuideFromAI();
  }, [description, guides.length]);

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case "נשלחה":
      case "נפתח":
        return "var(--warning-orange)";
      case "בטיפול":
        return "var(--primary-blue)";
      case "נסגר":
        return "var(--success-green)";
      default:
        return "var(--text-gray)";
    }
  };

  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
      case "נשלחה":
      case "נפתח":
        return "🚨";
      case "בטיפול":
        return "🚑";
      case "נסגר":
        return "✅";
      default:
        return "📋";
    }
  };

  return (
    <BackgroundLayout>
      <div className="confirmation-container">
        <h2 className="confirmation-title success-bounce">
          ✔️ הקריאה נשלחה בהצלחה
        </h2>
        
        <div className="alert-message">
          <div className="alert-message-text">
            🚑 כעת יצאו כוננים לאזור שלך!
          </div>
          <div style={{ fontSize: "1rem", color: "var(--emergency-text-red)" }}>
            אנא הישאר במקום ושמור על קשר
          </div>
        </div>

        <div className="status-container">
          <div className="status-text">
            {getStatusIcon(status)} סטטוס הקריאה: 
            <span 
              className="status-value"
              style={{ color: getStatusColor(status) }}
            >
              {status}
            </span>
          </div>
        </div>

        {/* כפתורים לניווט */}
        <div className="action-buttons">
          <button 
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            🏠 חזור לעמוד הבית
          </button>
          <button 
            className="primary-btn"
            onClick={() => navigate("/my-calls")}
          >
            📋 הקריאות שלי
          </button>
        </div>

        {/* הוראות עזרה ראשונה */}
        {(guides.length > 0 || isLoadingGuides) && (
          <div className="guides-section">
            <h3 className="guides-title">
              📋 הוראות עזרה ראשונה
            </h3>
            
            {isLoadingGuides ? (
              <div className="loading-container">
                <span className="loading-spinner"></span>
                <span>טוען הוראות עזרה ראשונה...</span>
              </div>
            ) : (
              <div className="guides-container">
                {guides.map((guide, index) => (
                  <div key={index} className="guide-card">
                    <h4 className="guide-title">
                      🩺 {guide.title}
                    </h4>
                    <div className="guide-description">
                      {guide.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* הודעת זהירות */}
        <div className="warning-note">
          <strong>⚠️ חשוב:</strong> הוראות אלו הן לעזרה ראשונה בלבד. 
          אל תחליף טיפול רפואי מקצועי.
        </div>
      </div>
    </BackgroundLayout>
  );
}
// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useLocation, useNavigate } from "react-router-dom"
// import { getCallStatus, getCallById } from "../../services/calls.service"
// import type { Call } from "../../types"
// import { CheckCircle, Users, Clock, MapPin, Phone, RefreshCw, Home, FileText } from "lucide-react"
// import BackgroundLayout from "../../layouts/BackgroundLayout"


// interface LocationState {
//   callId: number
//   message: string
//   firstAidSuggestions?: any[]
// }

// export default function CallConfirmationPage() {
//   const { callId } = useParams<{ callId: string }>()
//   const location = useLocation()
//   const navigate = useNavigate()

//   const state = location.state as LocationState
//   const [call, setCall] = useState<Call | null>(null)
//   const [callStatus, setCallStatus] = useState<string>("Open")
//   const [volunteersCount, setVolunteersCount] = useState<number>(0)
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   // 🔧 טעינת נתוני הקריאה
//   useEffect(() => {
//     if (callId) {
//       loadCallData()
//       // רענון כל 30 שניות
//       const interval = setInterval(refreshCallStatus, 3000)
//       return () => clearInterval(interval)
//     }
//   }, [callId])

//   // 🔧 טעינת נתוני הקריאה
//   const loadCallData = async () => {
//     if (!callId) return

//     try {
//       setLoading(true)
//       console.log("📋 Loading call data for ID:", callId)

//       // קבלת פרטי הקריאה
//       const callResponse = await getCallById(Number(callId))
//       setCall(callResponse.data)

//       // קבלת סטטוס הקריאה
//       const statusResponse = await getCallStatus(Number(callId))
//       setCallStatus(statusResponse.data.status)
//       setVolunteersCount(statusResponse.data.volunteersCount || 0)

//       console.log("✅ Call data loaded:", {
//         call: callResponse.data,
//         status: statusResponse.data,
//       })
//     } catch (error) {
//       console.error("❌ Failed to load call data:", error)
//       alert("שגיאה בטעינת נתוני הקריאה")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 🔧 רענון סטטוס הקריאה
//   const refreshCallStatus = async () => {
//     if (!callId || refreshing) return

//     try {
//       setRefreshing(true)
//       console.log("🔄 Refreshing call status...")

//       const statusResponse = await getCallStatus(Number(callId))
//       setCallStatus(statusResponse.data.status)
//       setVolunteersCount(statusResponse.data.volunteersCount || 0)

//       console.log("✅ Status refreshed:", statusResponse.data)
//     } catch (error) {
//       console.error("❌ Failed to refresh status:", error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   // 🔧 קבלת טקסט סטטוס בעברית
//   const getStatusText = (status: string): string => {
//     switch (status) {
//       case "Open":
//         return "פתוחה - מחפש מתנדבים"
//       case "InProgress":
//         return "בטיפול - מתנדבים בדרך"
//       case "Closed":
//         return "סגורה - הטיפול הושלם"
//       default:
//         return status
//     }
//   }

//   // 🔧 קבלת צבע סטטוס
//   const getStatusColor = (status: string): string => {
//     switch (status) {
//       case "Open":
//         return "var(--warning-orange)"
//       case "InProgress":
//         return "var(--primary-blue)"
//       case "Closed":
//         return "var(--success-green)"
//       default:
//         return "var(--text-gray)"
//     }
//   }

//   // 🔧 קבלת אייקון סטטוס
//   const getStatusIcon = (status: string): string => {
//     switch (status) {
//       case "Open":
//         return "🚨"
//       case "InProgress":
//         return "🚑"
//       case "Closed":
//         return "✅"
//       default:
//         return "📋"
//     }
//   }

//   if (loading) {
//     return (
//       <BackgroundLayout>
//         <div className="confirmation-container">
//           <div className="loading-container">
//             <RefreshCw className="loading-spinner" />
//             טוען נתוני קריאה...
//           </div>
//         </div>
//       </BackgroundLayout>
//     )
//   }

//   return (
//     <BackgroundLayout>
//       <div className="confirmation-container">
//         {/* כותרת אישור */}
//         <div className="confirmation-title success-bounce">
//           <CheckCircle size={48} />
//           קריאת החירום נשלחה בהצלחה!
//         </div>

//         {/* הודעת אישור */}
//         <div className="alert-message">
//           <div className="alert-message-text">{state?.message || "🚑 כעת יצאו כוננים לאזור שלך!"}</div>
//           <div className="call-id-text">מספר קריאה: #{callId}</div>
//           <div style={{ fontSize: "1rem", color: "var(--emergency-text-red)" }}>אנא הישאר במקום ושמור על קשר</div>
//         </div>

//         {/* סטטוס הקריאה */}
//         <div className="status-container">
//           <div className="status-text">
//             <div className="status-label">{getStatusIcon(callStatus)} סטטוס הקריאה:</div>
//             <div className="status-value" style={{ color: getStatusColor(callStatus) }}>
//               {getStatusText(callStatus)}
//             </div>
//           </div>

//           <div className="volunteers-info">
//             <Users size={20} />
//             <span>{volunteersCount > 0 ? `${volunteersCount} מתנדבים מגיבים` : "מחפש מתנדבים באזור..."}</span>
//           </div>

//           <button onClick={refreshCallStatus} disabled={refreshing} className="refresh-btn">
//             {refreshing ? <RefreshCw className="loading-spinner" /> : <RefreshCw size={16} />}
//             רענן סטטוס
//           </button>
//         </div>

//         {/* פרטי הקריאה */}
//         {call && (
//           <div className="call-details">
//             <h3>פרטי הקריאה</h3>
//             <div className="detail-item">
//               <Clock size={16} />
//               <span>נוצרה: {new Date(call.createdAt).toLocaleString("he-IL")}</span>
//             </div>
//             <div className="detail-item">
//               <MapPin size={16} />
//               <span>
//                 מיקום: {call.locationY.toFixed(4)}, {call.locationX.toFixed(4)}
//               </span>
//             </div>
//             <div className="detail-item">
//               <span className="urgency-badge urgency-{call.urgencyLevel}">דחיפות: {call.urgencyLevel}</span>
//             </div>
//             {call.description && (
//               <div className="description-box">
//                 <strong>תיאור:</strong>
//                 <p>{call.description}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* הצעות עזרה ראשונה */}
//         {state?.firstAidSuggestions && state.firstAidSuggestions.length > 0 && (
//           <div className="guides-section">
//             <div className="guides-title">🏥 הנחיות עזרה ראשונה</div>
//             <div className="guides-container">
//               {state.firstAidSuggestions.map((guide, index) => (
//                 <div key={index} className="guide-card">
//                   <div className="guide-title">{guide.title}</div>
//                   <div className="guide-description">{guide.description}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* מידע חשוב */}
//         <div className="important-info">
//           <h3>מידע חשוב:</h3>
//           <ul>
//             <li>מתנדבים באזור קיבלו התראה על הקריאה</li>
//             <li>הסטטוס יתעדכן אוטומטית כשמתנדבים יגיבו</li>
//             <li>במקרה חירום מיידי - התקשר למד"א 101</li>
//             <li>שמור את מספר הקריאה למעקב</li>
//           </ul>
//         </div>

//         {/* כפתורי פעולה */}
//         <div className="action-buttons">
//           <button onClick={() => navigate("/")} className="secondary-btn">
//             <Home size={20} />
//             חזור לדף הבית
//           </button>
//           <button onClick={() => navigate("/my-calls")} className="primary-btn">
//             <FileText size={20} />
//             הקריאות שלי
//           </button>
//           <button onClick={() => (window.location.href = "tel:101")} className="emergency-call-btn">
//             <Phone size={20} />
//             התקשר למד"א 101
//           </button>
//         </div>

//         {/* הודעת זהירות */}
//         <div className="warning-note">
//           <strong>⚠️ חשוב:</strong> הוראות אלו הן לעזרה ראשונה בלבד. אל תחליף טיפול רפואי מקצועי.
//         </div>
//       </div>
//     </BackgroundLayout>
//   )
// }
