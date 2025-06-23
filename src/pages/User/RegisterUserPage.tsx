import { useState } from "react";
import { registerUser } from "../../services/auth.service";
import FormLayout from "../../components/FormLayout";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { useNavigate } from "react-router-dom";
import { setSession } from "../../auth/auth.utils";
import { Paths } from "../../routes/paths";
import { UserRegisterData } from "../../types/auth.types";

import "../register.css"; // יבוא קובץ ה-CSS

interface ValidationErrors {
  [key: string]: string;
}

export default function RegisterUserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRegisterData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gmail: "",
    password: "",
    Role: ""
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // פונקציות אימות
  const validateName = (name: string): string => {
    if (!name.trim()) return "שדה זה הוא חובה";
    if (name.trim().length < 2) return "השם חייב להכיל לפחות 2 תווים";
    if (!/^[\u0590-\u05FFa-zA-Z\s]+$/.test(name)) return "השם יכול להכיל רק אותיות";
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

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return validateName(value);
      case 'phoneNumber':
        return validatePhone(value);
      case 'gmail':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setUser({ ...user, [name]: value });
    
    // אימות בזמן אמת
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    newErrors.firstName = validateName(user.firstName);
    newErrors.lastName = validateName(user.lastName);
    newErrors.phoneNumber = validatePhone(user.phoneNumber);
    newErrors.gmail = validateEmail(user.gmail);
    newErrors.password = validatePassword(user.password);
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("אנא תקן את השגיאות בטופס");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await registerUser(user);
      const { token } = res.data;
      
      if (token) {
        setSession(token);
        alert("ההרשמה הצליחה!");
        navigate(`/${Paths.userHome}`);
      } else {
        alert("❗לא התקבל טוקן מהשרת");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        alert("שגיאה: " + err.response.data.message);
      } else {
        alert("שגיאה בהרשמה");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundLayout>
      <div className="content-wrapper">
        <div className="form-layout">
          <h2 className="form-title">טופס הרשמה למשתמשים</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                name="firstName"
                placeholder="שם פרטי"
                value={user.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : user.firstName ? 'success' : ''}
              />
              {errors.firstName && (
                <div className="error-message show">{errors.firstName}</div>
              )}
            </div>

            <div className="form-group">
              <input
                name="lastName"
                placeholder="שם משפחה"
                value={user.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : user.lastName ? 'success' : ''}
              />
              {errors.lastName && (
                <div className="error-message show">{errors.lastName}</div>
              )}
            </div>

            <div className="form-group">
              <input
                name="phoneNumber"
                placeholder="טלפון (לדוגמה: 050-1234567)"
                value={user.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? 'error' : user.phoneNumber ? 'success' : ''}
              />
              {errors.phoneNumber && (
                <div className="error-message show">{errors.phoneNumber}</div>
              )}
            </div>

            <div className="form-group">
              <input
                name="gmail"
                type="email"
                placeholder="אימייל"
                value={user.gmail}
                onChange={handleChange}
                className={errors.gmail ? 'error' : user.gmail ? 'success' : ''}
              />
              {errors.gmail && (
                <div className="error-message show">{errors.gmail}</div>
              )}
            </div>

            <div className="form-group">
              <input
                name="password"
                type="password"
                placeholder="סיסמה (לפחות 8 תווים)"
                value={user.password}
                onChange={handleChange}
                className={errors.password ? 'error' : user.password ? 'success' : ''}
              />
              {errors.password && (
                <div className="error-message show">{errors.password}</div>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "מבצע הרשמה..." : "הירשם עכשיו"}
            </button>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  );
}
