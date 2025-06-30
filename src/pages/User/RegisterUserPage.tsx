import { useState } from "react";
import { registerUser, checkUserExists } from "../../services/auth.service";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { useNavigate } from "react-router-dom";
import { setSession } from "../../auth/auth.utils";
import { Paths } from "../../routes/paths";
import { UserRegisterData } from "../../types/auth.types";

import "../register.css";

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
      case "firstName":
      case "lastName":
        return validateName(value);
      case "phoneNumber":
        return validatePhone(value);
      case "gmail":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      firstName: validateName(user.firstName),
      lastName: validateName(user.lastName),
      phoneNumber: validatePhone(user.phoneNumber),
      gmail: validateEmail(user.gmail),
      password: validatePassword(user.password)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const existsRes = await checkUserExists(user.gmail);
      if (existsRes.data.exists) {
        setErrors((prev) => ({
          ...prev,
          gmail: "כתובת אימייל זו כבר רשומה במערכת"
        }));
        setIsSubmitting(false);
        return;
      }

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
      alert("שגיאה בהרשמה");
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
            {["firstName", "lastName", "phoneNumber", "gmail", "password"].map((field) => (
              <div className="form-group" key={field}>
                <input
                  name={field}
                  type={field === "password" ? "password" : field === "gmail" ? "email" : "text"}
                  placeholder={
                    field === "firstName" ? "שם פרטי" :
                    field === "lastName" ? "שם משפחה" :
                    field === "phoneNumber" ? "טלפון (לדוגמה: 050-1234567)" :
                    field === "gmail" ? "אימייל" :
                    "סיסמה (לפחות 8 תווים)"
                  }
                  value={(user as any)[field]}
                  onChange={handleChange}
                  className={`form-input ${errors[field] ? "error" : ""}`}
                />
                {errors[field] && <div className="error-message">{errors[field]}</div>}
              </div>
            ))}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "מבצע הרשמה..." : "הירשם עכשיו"}
            </button>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  );
}
