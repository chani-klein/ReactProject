import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import axios from "../../services/axios";
import { jwtDecode } from "jwt-decode";


type TokenPayload = {
  nameid: string;
};

function getVolunteerIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = jwtDecode<any>(token);
    const id = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return id ? parseInt(id) : null;
  } catch (e) {
    console.error("⚠️ שגיאה בפענוח ה-token:", e);
    return null;
  }
}

export default function UpdateVolunteerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    gmail: ""
  });
  
  const volunteerId = getVolunteerIdFromToken();
  
  useEffect(() => {
    if (!volunteerId) return;
    
    axios.get(`/Volunteer/${volunteerId}`)
      .then(res => setFormData(res.data))
      .catch(() => alert("❌ שגיאה בטעינת פרטים"));
  }, [volunteerId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/Volunteer/${volunteerId}`, formData);
      alert("✅ נשמר בהצלחה");
    } catch {
      alert("❌ שגיאה בשמירה");
    }
  };
  
  return (
    <BackgroundLayout>
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <span className="back-icon">←</span>
          חזור
        </button>
      </div>
      <div className="update-volunteer-container">
        {/* כרטיס פרטי המתנדב */}
        <div className="volunteer-info-card">
          <h2 className="info-title">
            <span className="info-icon">👤</span>
            פרטי המתנדב
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">מספר מתנדב:</span>
              <span className="info-value">{volunteerId || "לא זמין"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">שם מתנדב:</span>
              <span className="info-value">{formData.fullName || "לא זמין"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">כתובת:</span>
              <span className="info-value">
                {formData.address && formData.city 
                  ? `${formData.address}, ${formData.city}` 
                  : "לא זמין"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">מייל:</span>
              <span className="info-value">{formData.gmail || "לא זמין"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">פלאפון:</span>
              <span className="info-value">{formData.phone || "לא זמין"}</span>
            </div>
          </div>
        </div>
        
        {/* כרטיס טופס עדכון */}
        <div className="form-card">
          <h2 className="form-title">
            <span className="form-icon">✏️</span>
            עדכון פרטים אישיים
          </h2>
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label htmlFor="fullName">שם מלא</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="הכנס שם מלא"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">טלפון</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="הכנס מספר טלפון"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">עיר</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="הכנס עיר מגורים"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">כתובת</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="הכנס כתובת מדויקת"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gmail">אימייל</label>
              <input
                id="gmail"
                name="gmail"
                type="email"
                placeholder="הכנס כתובת אימייל"
                value={formData.gmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <button type="submit" className="submit-btn">
              <span className="btn-icon">💾</span>
              שמור שינויים
            </button>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  );
}