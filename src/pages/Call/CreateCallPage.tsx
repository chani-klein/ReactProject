// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import BackgroundLayout from "../../layouts/BackgroundLayout";
// import { createCall, getFirstAidSuggestions } from "../../services/calls.service";
// import "../../style/emergency-styles.css"; // יבוא קובץ ה-CSS

// export default function CreateCallPage() {
//   const navigate = useNavigate();
//   const [location, setLocation] = useState<{ x: string; y: string } | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     description: "",
//     urgencyLevel: "",
//     status: "נפתח",
//     fileImage: null as File | null,
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) =>
//         setLocation({
//           x: pos.coords.latitude.toString(),
//           y: pos.coords.longitude.toString(),
//         }),
//       () => alert("⚠️ לא הצלחנו לאתר מיקום")
//     );
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     if (type === "file") {
//       const target = e.target as HTMLInputElement;
//       setFormData({ ...formData, [name]: target.files?.[0] || null });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!location) {
//       alert("📍 אין מיקום זמין עדיין");
//       return;
//     }

//     setIsLoading(true);
    
//     const data = new FormData();
   
//     data.append("Status", formData.status);
//     data.append("LocationX", Number(location.x).toString());
//     data.append("LocationY", Number(location.y).toString());
//    data.append("UrgencyLevel", Number(formData.urgencyLevel).toString());
//     data.append("Date", new Date().toISOString());


//     if (formData.description) data.append("Description", formData.description);
//     if (formData.fileImage) data.append("FileImage", formData.fileImage);

//     try {
//       await createCall(data);
//       let guides = [];
//       if (formData.description) {
//         const response = await getFirstAidSuggestions(formData.description);
//         guides = response.data;
//       }
//       navigate("/call-confirmation", { state: { guides } });
//     } catch {
//       alert("❌ שגיאה בשליחה");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <BackgroundLayout>
//       <div className="create-call-container">
//         <h2 className="page-title">🚨 פתיחת קריאה</h2>
        
//         <form onSubmit={handleSubmit} className="form">
//           <textarea
//             name="description"
//             placeholder="תיאור המצב (לא חובה) - תאר מה קרה בקצרה"
//             value={formData.description}
//             onChange={handleChange}
//             rows={4}
//             className="form-textarea"
//           />
          
//           <input
//             name="urgencyLevel"
//             placeholder="רמת דחיפות: דחוף / בינוני / נמוך (לא חובה)"
//             value={formData.urgencyLevel}
//             onChange={handleChange}
//             type="text"
//           />
          
//           <div className="file-upload-container">
//             <input 
//               type="file" 
//               name="fileImage" 
//               onChange={handleChange}
//               accept="image/*"
//             />
//             <small className="file-help-text">
//               📸 אפשר לצרף תמונה להמחשת המצב
//             </small>
//           </div>
          
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <span className="loading-spinner"></span>
//                 שולח קריאה...
//               </>
//             ) : (
//               "📤 שלח קריאה רגילה"
//             )}
//           </button>
//         </form>
//       </div>
//     </BackgroundLayout>
//   );
// }
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createCall, assignNearbyVolunteers, getFirstAidSuggestions } from "../../services/calls.service"
import type { CallCreateRequest } from "../../types"
import { AlertTriangle, Camera, MapPin, Send, Loader2 } from "lucide-react"
import BackgroundLayout from "../../layouts/BackgroundLayout"
// import "../../styles/emergency-styles.css"

// בתחילת הקובץ, הוסף enum לרמות דחיפות
enum UrgencyLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

interface LocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export default function CreateCallPage() {
  const navigate = useNavigate()

  // State לטופס
  const [formData, setFormData] = useState<CallCreateRequest>({
    description: "",
    urgencyLevel: UrgencyLevel.MEDIUM,
    locationX: 0,
    locationY: 0,
    fileImage: undefined,
  })

  // State למיקום
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  // State כללי
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [firstAidSuggestions, setFirstAidSuggestions] = useState<any[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  // 🔧 קבלת מיקום בטעינת הדף
  useEffect(() => {
    getCurrentLocation()
  }, [])

  // 🔧 קבלת הצעות עזרה ראשונה כשמשנים תיאור - עם debounce משופר
  useEffect(() => {
    if (formData.description && formData.description.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        getFirstAidSuggestionsDebounced()
      }, 2000) // 2 שניות debounce

      return () => clearTimeout(timeoutId)
    } else {
      setFirstAidSuggestions([])
      setLoadingSuggestions(false)
    }
  }, [formData.description])

  // 🔧 פונקציה לקבלת מיקום
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "הדפדפן לא תומך בזיהוי מיקום",
        loading: false,
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log("📍 Location obtained:", { latitude, longitude })

        setLocation({
          latitude,
          longitude,
          error: null,
          loading: false,
        })

        setFormData((prev) => ({
          ...prev,
          locationX: longitude,
          locationY: latitude,
        }))
      },
      (error) => {
        console.error("❌ Location error:", error)
        let errorMessage = "לא ניתן לקבל מיקום"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "הרשאת מיקום נדחתה - אנא אפשר גישה למיקום"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "מיקום לא זמין"
            break
          case error.TIMEOUT:
            errorMessage = "זמן קבלת המיקום פג"
            break
        }

        setLocation({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  // 🔧 טיפול בשינוי שדות
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 🔧 טיפול בבחירת תמונה
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // בדיקת גודל קובץ (מקסימום 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("גודל התמונה חייב להיות קטן מ-5MB")
        return
      }

      // בדיקת סוג קובץ
      if (!file.type.startsWith("image/")) {
        alert("אנא בחר קובץ תמונה בלבד")
        return
      }

      setSelectedImage(file)
      setFormData((prev) => ({ ...prev, fileImage: file }))

      // יצירת תצוגה מקדימה
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      console.log("📷 Image selected:", { name: file.name, size: file.size, type: file.type })
    }
  }

  // 🔧 קבלת הצעות עזרה ראשונה עם טיפול משופר בשגיאות
  const getFirstAidSuggestionsDebounced = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      return
    }

    setLoadingSuggestions(true)

    try {
      console.log("🏥 Requesting first aid suggestions for:", formData.description)
      const response = await getFirstAidSuggestions(formData.description.trim())

      if (response.data && Array.isArray(response.data)) {
        setFirstAidSuggestions(response.data)
        console.log("✅ First aid suggestions received:", response.data.length, "suggestions")
      } else {
        console.log("ℹ️ No first aid suggestions available")
        setFirstAidSuggestions([])
      }
    } catch (error) {
      console.error("❌ Failed to get first aid suggestions:", error)
      setFirstAidSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // 🔧 שליחת הטופס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔧 ולידציות משופרות
    if (!formData.description || formData.description.trim() === "") {
      alert("אנא הזן תיאור הקריאה")
      return
    }

    if (formData.description.trim().length < 2) {
      alert("תיאור הקריאה חייב להכיל לפחות 2 תווים")
      return
    }

    if (!formData.urgencyLevel || formData.urgencyLevel < 1 || formData.urgencyLevel > 4) {
      alert("אנא בחר רמת דחיפות תקינה")
      return
    }

    if (location.latitude === null || location.longitude === null) {
      alert("לא ניתן לקבל מיקום - אנא נסה שוב או אפשר גישה למיקום")
      return
    }

    // 🔧 וידוא שהמיקום תקין
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      alert("מיקום לא תקין - אנא נסה לרענן את הדף")
      return
    }

    setIsSubmitting(true)

    try {
      // 🔧 יצירת אובייקט נתונים מסודר
      const callRequest: CallCreateRequest = {
        description: formData.description.trim(),
        urgencyLevel: Number(formData.urgencyLevel),
        locationX: Number(location.longitude),
        locationY: Number(location.latitude),
        fileImage: formData.fileImage || undefined,
      }

      console.log("🚨 Submitting emergency call with data:", {
        ...callRequest,
        fileImage: callRequest.fileImage ? `File: ${callRequest.fileImage.name}` : "No file",
      })

      // יצירת הקריאה
      const callResponse = await createCall(callRequest)
      const callId = callResponse.data.id

      console.log("✅ Call created with ID:", callId)

      // שיוך מתנדבים קרובים
      try {
        await assignNearbyVolunteers(callId)
        console.log("✅ Nearby volunteers assigned")
      } catch (assignError) {
        console.warn("⚠️ Failed to assign volunteers, but call was created:", assignError)
      }

      // מעבר לדף אישור
      navigate(`/call-confirmation/${callId}`, {
        state: {
          callId,
          message: callResponse.data.message || "הקריאה נשלחה בהצלחה",
          firstAidSuggestions,
        },
      })
    } catch (error: any) {
      console.error("❌ Failed to create call:", error)

      let errorMessage = "שגיאה ביצירת הקריאה"

      if (error.message && error.message.includes("Validation errors:")) {
        errorMessage = `שגיאות validation:\n${error.message.replace("Validation errors:\n", "")}`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      alert(`שגיאה: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BackgroundLayout>
      <div className="create-call-container">
        <div className="page-title">
          <AlertTriangle className="emergency-icon" />
          יצירת קריאת חירום
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {/* תיאור הקריאה */}
          <div className="form-group">
            <label htmlFor="description">תיאור הקריאה *</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="תאר בקצרה מה קרה ואיך אפשר לעזור..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          {/* רמת דחיפות */}
          <div className="form-group">
            <label htmlFor="urgencyLevel">רמת דחיפות *</label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={(e) => setFormData((prev) => ({ ...prev, urgencyLevel: Number(e.target.value) }))}
              className="form-select"
              required
            >
              <option value={UrgencyLevel.LOW}>נמוכה</option>
              <option value={UrgencyLevel.MEDIUM}>בינוני</option>
              <option value={UrgencyLevel.HIGH}>גבוהה</option>
              <option value={UrgencyLevel.CRITICAL}>קריטית</option>
            </select>
          </div>

          {/* העלאת תמונה */}
          <div className="form-group">
            <label htmlFor="fileImage">תמונה (אופציונלי)</label>
            <div className="file-upload-container">
              <input
                id="fileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-file-input"
              />
              <div className="file-help-text">
                <Camera size={16} />
                מקסימום 5MB - JPG, PNG, GIF
              </div>
            </div>

            {/* תצוגה מקדימה של התמונה */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview || "/placeholder.svg"} alt="תצוגה מקדימה" className="preview-image" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                    setFormData((prev) => ({ ...prev, fileImage: undefined }))
                  }}
                  className="remove-image-btn"
                >
                  הסר תמונה
                </button>
              </div>
            )}
          </div>

          {/* מידע מיקום */}
          <div className="location-info">
            <MapPin size={20} />
            <div className="location-text">
              {location.loading && <span>מקבל מיקום...</span>}
              {location.error && <span className="error-text">{location.error}</span>}
              {location.latitude && location.longitude && (
                <span className="success-text">
                  מיקום התקבל בהצלחה ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </span>
              )}
            </div>
            {location.error && (
              <button type="button" onClick={getCurrentLocation} className="retry-location-btn">
                נסה שוב
              </button>
            )}
          </div>

          {/* הצעות עזרה ראשונה */}
          {formData.description && formData.description.trim().length > 10 && (
            <div className="first-aid-section">
              <h3 className="first-aid-title">
                🏥 הצעות עזרה ראשונה
                {loadingSuggestions && <Loader2 className="loading-spinner" />}
              </h3>

              {loadingSuggestions ? (
                <div className="suggestions-loading">
                  <p>מחפש הצעות עזרה ראשונה...</p>
                </div>
              ) : firstAidSuggestions.length > 0 ? (
                <div className="suggestions-container">
                  {firstAidSuggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-card">
                      <h4>{suggestion.title || suggestion.name || `הצעה ${index + 1}`}</h4>
                      <p>{suggestion.description || suggestion.content || suggestion.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-suggestions">
                  <p>לא נמצאו הצעות עזרה ראשונה ספציפיות לתיאור זה</p>
                  <p className="general-advice">💡 עצה כללית: שמור על רוגע, בדוק נשימה ודופק, והתקשר למד"א 101</p>
                </div>
              )}
            </div>
          )}

          {/* כפתורי פעולה */}
          <div className="action-buttons">
            <button
              type="submit"
              disabled={isSubmitting || location.loading || !location.latitude}
              className="primary-btn emergency-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="loading-spinner" />
                  שולח קריאה...
                </>
              ) : (
                <>
                  <Send size={20} />
                  שלח קריאת חירום
                </>
              )}
            </button>

            <button type="button" onClick={() => navigate(-1)} className="secondary-btn" disabled={isSubmitting}>
              ביטול
            </button>
          </div>
        </form>

        {/* הודעת אזהרה */}
        <div className="warning-note">⚠️ קריאה זו תישלח למתנדבים באזור. אנא וודא שמדובר במצב חירום אמיתי.</div>
      </div>
    </BackgroundLayout>
  )
}
