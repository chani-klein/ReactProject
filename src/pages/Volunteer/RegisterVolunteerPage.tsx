import { useState } from "react";
import { registerVolunteer } from "../../services/volunteer.service";
import FormLayout from "../../components/FormLayout";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { useNavigate } from "react-router-dom";
import { setSession } from "../../auth/auth.utils";
import { Paths } from "../../routes/paths";
import { VolunteerRegisterData } from "../../types/auth.types";
import { UserPlus, Heart, Shield } from "lucide-react";
import "../register.css";
import {checkVolunteerExists}  from "../../services/volunteer.service"

interface ValidationErrors {
  [key: string]: string;
}

export default function RegisterVolunteerPage() {
  const navigate = useNavigate();

  const [volunteer, setVolunteer] = useState<VolunteerRegisterData>({
    fullName: "",
    gmail: "",
    password: "",
    phoneNumber: "",
    specialization: "",
    address: "",
    city: "",
    role: "Volunteer"
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // פונקציות אימות
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "שם מלא הוא חובה";
    if (name.trim().length < 4) return "השם המלא חייב להכיל לפחות 4 תווים";
    if (!/^[\u0590-\u05FFa-zA-Z\s]+$/.test(name)) return "השם יכול להכיל רק אותיות";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "כתובת אימייל היא חובה";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "כתובת אימייל לא תקינה";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password.trim()) return "סיסמה היא חובה";
    if (password.length < 8) return "הסיסמה חייבת להכיל לפחות 8 תווים";
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return "הסיסמה חייבת להכיל לפחות אות אחת ומספר אחד";
    }
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "מספר טלפון הוא חובה";
    const phoneRegex = /^0\d{1,2}-?\d{7}$|^0\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return "מספר טלפון לא תקין (לדוגמה: 050-1234567)";
    }
    return "";
  };

  const validateSpecialization = (specialization: string): string => {
    if (!specialization.trim()) return "תחום התמחות הוא חובה";
    if (specialization.trim().length < 2) return "תחום התמחות חייב להכיל לפחות 2 תווים";
    return "";
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) return "כתובת היא חובה";
    if (address.trim().length < 5) return "כתובת חייבת להכיל לפחות 5 תווים";
    return "";
  };

  const validateCity = (city: string): string => {
    if (!city.trim()) return "עיר היא חובה";
    if (city.trim().length < 2) return "שם העיר חייב להכיל לפחות 2 תווים";
    if (!/^[\u0590-\u05FFa-zA-Z\s'-]+$/.test(city)) return "שם העיר יכול להכיל רק אותיות";
    return "";
  };

  // אימות שדה בודד
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        return validateFullName(value);
      case 'gmail':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'phoneNumber':
        return validatePhone(value);
      case 'specialization':
        return validateSpecialization(value);
      case 'address':
        return validateAddress(value);
      case 'city':
        return validateCity(value);
      default:
        return "";
    }
  };

  // אימות כל הטופס
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(volunteer).forEach(key => {
      if (key !== 'role') {
        const error = validateField(key, volunteer[key as keyof VolunteerRegisterData] as string);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setVolunteer(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!validateForm()) {
    setIsSubmitting(false);
    return;
  }

  try {
    // בדיקה אם המשתמש כבר קיים לפי אימייל
    const existsRes = await checkVolunteerExists(volunteer.gmail);
    if (existsRes.data.exists) {
      setErrors(prev => ({
        ...prev,
        gmail: "כתובת אימייל זו כבר רשומה במערכת"
      }));
      setIsSubmitting(false);
      return;
    }

    const res = await registerVolunteer(volunteer);
    const { token, id } = res.data;

    setSession(token);
    if (id) localStorage.setItem("volunteerId", id.toString());

    alert("נרשמת בהצלחה כמתנדב!");
    navigate(`/${Paths.volunteerHome}`);
  } catch (err: any) {
    if (err.response) {
      console.error("שגיאת שרת:", err.response.data);
      alert("שגיאה: " + JSON.stringify(err.response.data));
    } else {
      console.error(err);
      alert("שגיאה לא צפויה בהרשמה");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="volunteer-registration">
      <div className="registration-container">
        <div className="registration-header">
          <div className="registration-icon">
            <Heart />
          </div>
          <h1 className="registration-title">הצטרפות למתנדבים</h1>
          <p className="registration-subtitle">הירשם והפוך לחלק מקהילת המתנדבים שלנו</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              name="fullName" 
              placeholder="שם מלא" 
              value={volunteer.fullName}
              onChange={handleChange}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              required
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <input 
              name="gmail" 
              type="email"
              placeholder="כתובת אימייל" 
              value={volunteer.gmail}
              onChange={handleChange}
              className={`form-input ${errors.gmail ? 'error' : ''}`}
              required
            />
            {errors.gmail && <span className="error-message">{errors.gmail}</span>}
          </div>

          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="סיסמה (לפחות 8 תווים)" 
              value={volunteer.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input 
              name="phoneNumber" 
              placeholder="מספר טלפון (050-1234567)" 
              value={volunteer.phoneNumber}
              onChange={handleChange}
              className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              required
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <input 
              name="specialization" 
              placeholder="תחום התמחות (חובש, עזרה ראשונה, רפואה...)" 
              value={volunteer.specialization}
              onChange={handleChange}
              className={`form-input ${errors.specialization ? 'error' : ''}`}
              required
            />
            {errors.specialization && <span className="error-message">{errors.specialization}</span>}
          </div>

          <div className="form-group">
            <input 
              name="address" 
              placeholder="כתובת מלאה" 
              value={volunteer.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'error' : ''}`}
              required
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <input 
              name="city" 
              placeholder="עיר מגורים" 
              value={volunteer.city}
              onChange={handleChange}
              className={`form-input ${errors.city ? 'error' : ''}`}
              required
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? (
              <>
                נרשם...
                <span className="loading-spinner"></span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                הירשם כמתנדב
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}