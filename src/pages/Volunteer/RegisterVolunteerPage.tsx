"use client"
import { useState, useEffect } from "react"
import type React from "react"

 import {registerVolunteer} from "../../services/volunteer.service";

import { useNavigate } from "react-router-dom"
import { setSession } from "../../auth/auth.utils"
import { Paths } from "../../routes/paths"
import type { VolunteerRegisterData } from "../../types"
import { UserPlus, Heart } from "lucide-react"
import "../register.css"
import BackgroundLayout from "../../layouts/BackgroundLayout"

interface ValidationErrors {
  [key: string]: string
}

export default function RegisterVolunteerPage() {
  const navigate = useNavigate()

  const [volunteer, setVolunteer] = useState<VolunteerRegisterData>({
    fullName: "",
    Gmail: "", // חזרה ל-Gmail לפי ההגדרה בטייפ
    password: "",
    phoneNumber: "",
    specialization: "",
    address: "",
    city: "",
    role: "Volunteer",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // אם יש token, נבצע redirect לדף הבית של מתנדב
    if (localStorage.getItem("token")) {
      navigate(`/${Paths.volunteerHome}`);
    }
  }, []);

  // פונקציות אימות
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "שם מלא הוא חובה"
    if (name.trim().length < 4) return "השם המלא חייב להכיל לפחות 4 תווים"
    if (!/^[\u0590-\u05FFa-zA-Z\s]+$/.test(name)) return "השם יכול להכיל רק אותיות"
    return ""
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "כתובת אימייל היא חובה"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "כתובת אימייל לא תקינה"
    return ""
  }

  const validatePassword = (password: string): string => {
    if (!password.trim()) return "סיסמה היא חובה"
    if (password.length < 8) return "הסיסמה חייבת להכיל לפחות 8 תווים"
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return "הסיסמה חייבת להכיל לפחות אות אחת ומספר אחד"
    }
    return ""
  }

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "מספר טלפון הוא חובה"
    const phoneRegex = /^0\d{1,2}-?\d{7}$|^0\d{9}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "מספר טלפון לא תקין (לדוגמה: 050-1234567)"
    }
    return ""
  }

  const validateSpecialization = (specialization: string): string => {
    if (!specialization.trim()) return "תחום התמחות הוא חובה"
    if (specialization.trim().length < 2) return "תחום התמחות חייב להכיל לפחות 2 תווים"
    return ""
  }

  const validateAddress = (address: string): string => {
    if (!address.trim()) return "כתובת היא חובה"
    if (address.trim().length < 5) return "כתובת חייבת להכיל לפחות 5 תווים"
    return ""
  }

  const validateCity = (city: string): string => {
    if (!city.trim()) return "עיר היא חובה"
    if (city.trim().length < 2) return "שם העיר חייב להכיל לפחות 2 תווים"
    if (!/^[\u0590-\u05FFa-zA-Z\s'-]+$/.test(city)) return "שם העיר יכול להכיל רק אותיות"
    return ""
  }

  // אימות שדה בודד
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "fullName":
        return validateFullName(value)
      case "Gmail": // שינוי מ-email ל-Gmail
        return validateEmail(value)
      case "password":
        return validatePassword(value)
      case "phoneNumber":
        return validatePhone(value)
      case "specialization":
        return validateSpecialization(value)
      case "address":
        return validateAddress(value)
      case "city":
        return validateCity(value)
      default:
        return ""
    }
  }

  // אימות כל הטופס
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    Object.keys(volunteer).forEach((key) => {
      if (key !== "role") {
        const error = validateField(key, volunteer[key as keyof VolunteerRegisterData] as string)
        if (error) {
          newErrors[key] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setVolunteer((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      const res = await registerVolunteer(volunteer)
      const { token, id } = res.data

      setSession(token)
      if (id) {
        localStorage.setItem("volunteerId", id.toString())
      }

      alert("נרשמת בהצלחה כמתנדב!")
      navigate(`/${Paths.volunteerHome}`)
    } catch (err: any) {
      // טיפול משופר בשגיאות הרשמה
      console.error("Volunteer registration error:", err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data.message === "string") {
          // בדיקת הודעת שגיאה על מייל קיים
          if (
            data.message.includes("exists") ||
            data.message.includes("קיים") ||
            data.message.includes("משתמש עם האימייל הזה כבר קיים")
          ) {
            alert("האימייל כבר קיים במערכת. אנא השתמש באימייל אחר.");
          } 
        } else if (data.errors) {
          // טיפול בשגיאות ולידציה מרובות
          if (typeof data.errors === "string") {
            alert(data.errors);
          } else {
            alert(JSON.stringify(data.errors, null, 2));
          }
        } else {
          alert("שגיאה לא ידועה בשרת: " + JSON.stringify(data));
        }
      } else if (typeof err === "string") {
        alert("שגיאה: " + err);
      } else {
        alert("❌ שגיאה כללית בשליחה. נסה שוב או פנה לתמיכה.");
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BackgroundLayout>
      <div className="content-wrapper">
        <div className="form-layout">
          <h2 className="form-title">טופס הרשמה למתנדבים</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                name="fullName"
                placeholder="שם מלא"
                value={volunteer.fullName}
                onChange={handleChange}
                className={errors.fullName ? "error" : volunteer.fullName ? "success" : ""}
                required
              />
              {errors.fullName && <div className="error-message show">{errors.fullName}</div>}
            </div>
            <div className="form-group">
              <input
                name="Gmail"
                type="email"
                placeholder="כתובת אימייל"
                value={volunteer.Gmail}
                onChange={handleChange}
                className={errors.Gmail ? "error" : volunteer.Gmail ? "success" : ""}
                autoComplete="email"
                required
              />
              {errors.Gmail && <div className="error-message show">{errors.Gmail}</div>}
            </div>
            <div className="form-group">
              <input
                name="password"
                type="password"
                placeholder="סיסמה (לפחות 8 תווים)"
                value={volunteer.password}
                onChange={handleChange}
                className={errors.password ? "error" : volunteer.password ? "success" : ""}
                required
              />
              {errors.password && <div className="error-message show">{errors.password}</div>}
            </div>
            <div className="form-group">
              <input
                name="phoneNumber"
                placeholder="מספר טלפון (050-1234567)"
                value={volunteer.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "error" : volunteer.phoneNumber ? "success" : ""}
                required
              />
              {errors.phoneNumber && <div className="error-message show">{errors.phoneNumber}</div>}
            </div>
            <div className="form-group">
              <input
                name="specialization"
                placeholder="תחום התמחות (חובש, עזרה ראשונה, רפואה...)"
                value={volunteer.specialization}
                onChange={handleChange}
                className={errors.specialization ? "error" : volunteer.specialization ? "success" : ""}
                required
              />
              {errors.specialization && <div className="error-message show">{errors.specialization}</div>}
            </div>
            <div className="form-group">
              <input
                name="address"
                placeholder="כתובת מלאה"
                value={volunteer.address}
                onChange={handleChange}
                className={errors.address ? "error" : volunteer.address ? "success" : ""}
                required
              />
              {errors.address && <div className="error-message show">{errors.address}</div>}
            </div>
            <div className="form-group">
              <input
                name="city"
                placeholder="עיר מגורים"
                value={volunteer.city}
                onChange={handleChange}
                className={errors.city ? "error" : volunteer.city ? "success" : ""}
                required
              />
              {errors.city && <div className="error-message show">{errors.city}</div>}
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "נרשם..." : "הירשם כמתנדב"}
            </button>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  )
}
