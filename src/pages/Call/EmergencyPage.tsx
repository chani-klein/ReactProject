// EmergencyPage.tsx - עמוד הבית עם עיצוב מודרני
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { createCall } from "../../services/calls.service";
import "../../style/emergency-styles.css"; // יבוא קובץ ה-CSS
import type { CallResponse } from "../../types/call.types";

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ x: string; y: string } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          x: pos.coords.latitude.toString(),
          y: pos.coords.longitude.toString(),
        }),
      () => alert("⚠️ לא הצלחנו לאתר מיקום")
    );
  }, []);

  const sendSosCall = async () => {
    if (!location) {
      alert("📍 אין מיקום זמין עדיין");
      return;
    }

    // וידוא שהמיקום תקין
    const lat = Number.parseFloat(location.x);
    const lng = Number.parseFloat(location.y);
    if (isNaN(lat) || isNaN(lng)) {
      alert("📍 מיקום לא תקין - אנא נסה שוב");
      return;
    }

    try {
      // שליחת קריאה עם כל השדות הנדרשים
      const sosCallData = {
        description: "קריאת SOS דחופה - נדרשת עזרה מיידית",
        urgencyLevel: 4, // קריטית
        locationX: lng, // longitude
        locationY: lat, // latitude
      };
      const response = await createCall(sosCallData);
      const callId = response.data.id;
      navigate(`/call-confirmation/${callId}`, {
        state: {
          callId,
          message: "קריאת SOS נשלחה בהצלחה!",
          firstAidSuggestions: [],
        },
      });
    } catch (error: any) {
      let errorMessage = "שגיאה בשליחת קריאת SOS";
      if (error.message && error.message.includes("Validation errors:")) {
        errorMessage = `שגיאות אימות:\n${error.message.replace("Validation errors:\n", "")}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <BackgroundLayout>
      <div className="emergency-container">
        <div className="emergency-content">
          {/* כפתור חירום ראשי גדול */}
          <button 
            className="main-emergency-btn emergency-pulse" 
            onClick={() => navigate("/CreateCallPage")}
          >
            <div className="btn-content">
              <div className="emergency-icon">🚨</div>
              <div className="emergency-text">פתח קריאת חירום</div>
            </div>
          </button>

          {/* כפתור SOS קטן */}
          <button className="sos-btn" onClick={sendSosCall}>
            SOS
          </button>

          {/* כפתור קריאה רגילה - מוסתר כרגע
          <button className="regular-call-btn" onClick={() => navigate("/CreateCallPage")}>
            <span className="btn-icon">✏️</span>
            קריאה רגילה
          </button> */}
        </div>
      </div>
    </BackgroundLayout>
  );
}
// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import BackgroundLayout from "../../layouts/BackgroundLayout"
// import { createCall } from "../../services/calls.service"
// import { AlertTriangle, Phone, FileText } from "lucide-react"

// import type { CallCreateRequest } from "../../types/call.types"
// // import "../../styles/emergency-styles.css"

// export default function EmergencyPage() {
//   const navigate = useNavigate()
//   const [location, setLocation] = useState<{ x: string; y: string } | null>(null)
//   const [isLoadingLocation, setIsLoadingLocation] = useState(true)

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           x: pos.coords.latitude.toString(),
//           y: pos.coords.longitude.toString(),
//         })
//         setIsLoadingLocation(false)
//       },
//       (error) => {
//         console.error("Location error:", error)
//         alert("⚠️ לא הצלחנו לאתר מיקום - אנא אפשר גישה למיקום")
//         setIsLoadingLocation(false)
//       },
//     )
//   }, [])

//   // 🔧 תיקון פונקציית SOS
//   const sendSosCall = async () => {
//     if (!location) {
//       alert("📍 אין מיקום זמין עדיין")
//       return
//     }

//     // 🔧 וידוא שהמיקום תקין
//     const lat = Number.parseFloat(location.x)
//     const lng = Number.parseFloat(location.y)

//     if (isNaN(lat) || isNaN(lng)) {
//       alert("📍 מיקום לא תקין - אנא נסה שוב")
//       return
//     }

//     try {
//       // 🔧 יצירת אובייקט CallCreateRequest במקום FormData
//       const sosCallData: CallCreateRequest = {
//         description: "קריאת SOS דחופה - נדרשת עזרה מיידית",
//         urgencyLevel: 4, // קריטית
//         locationX: lng, // longitude
//         locationY: lat, // latitude
//       }

//       console.log("🆘 Sending SOS call with data:", sosCallData)

//       const response = await createCall(sosCallData)
//       const callId = response.data.id

//       console.log("✅ SOS call created with ID:", callId)

//       navigate(`/call-confirmation/${callId}`, {
//         state: {
//           callId,
//           message: "קריאת SOS נשלחה בהצלחה!",
//           firstAidSuggestions: [],
//         },
//       })
//     } catch (error: any) {
//       console.error("❌ SOS call failed:", error)

//       let errorMessage = "שגיאה בשליחת קריאת SOS"
//       if (error.message && error.message.includes("Validation errors:")) {
//         errorMessage = `שגיאות validation:\n${error.message.replace("Validation errors:\n", "")}`
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message
//       }

//       alert(errorMessage)
//     }
//   }

//   return (
//     <BackgroundLayout>
//       <div className="emergency-container">
//         <div className="emergency-content">
//           {/* כותרת ראשית */}
//           <div className="emergency-header">
//             <h1 className="emergency-main-title">מערכת חירום</h1>
//             <p className="emergency-subtitle">בחר את סוג הקריאה המתאימה</p>
//           </div>

//           {/* כפתור חירום ראשי גדול */}
//           <button
//             className="main-emergency-btn emergency-pulse"
//             onClick={() => navigate("/CreateCallPage")}
//             disabled={isLoadingLocation}
//           >
//             <div className="btn-content">
//               <div className="emergency-icon">
//                 <AlertTriangle size={48} />
//               </div>
//               <div className="emergency-text">פתח קריאת חירום</div>
//               <div className="emergency-subtext">קריאה מפורטת עם תיאור</div>
//             </div>
//           </button>

//           {/* כפתור SOS מהיר */}
//           <button className="sos-btn" onClick={sendSosCall} disabled={isLoadingLocation || !location}>
//             <div className="sos-content">
//               <div className="sos-icon">🆘</div>
//               <div className="sos-text">SOS</div>
//               <div className="sos-subtext">קריאה מהירה</div>
//             </div>
//           </button>

//           {/* כפתורים נוספים */}
//           <div className="additional-buttons">
//             <button className="secondary-action-btn" onClick={() => navigate("/my-calls")}>
//               <FileText size={24} />
//               <span>הקריאות שלי</span>
//             </button>

//             <button className="emergency-call-btn" onClick={() => (window.location.href = "tel:101")}>
//               <Phone size={24} />
//               <span>התקשר למד"א 101</span>
//             </button>
//           </div>

//           {/* מידע על מיקום */}
//           <div className="location-status">
//             {isLoadingLocation ? (
//               <p>🔍 מאתר מיקום...</p>
//             ) : location ? (
//               <p>✅ מיקום זוהה בהצלחה</p>
//             ) : (
//               <p>❌ לא ניתן לזהות מיקום</p>
//             )}
//           </div>

//           {/* הודעת אזהרה */}
//           <div className="warning-note">⚠️ השתמש במערכת זו רק במקרי חירום אמיתיים</div>
//         </div>
//       </div>
//     </BackgroundLayout>
//   )
// }
