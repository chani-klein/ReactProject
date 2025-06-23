import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { createCall, getFirstAidInstructions } from "../../services/calls.service";
import "../../style/emergency-styles.css"; // יבוא קובץ ה-CSS

export default function CreateCallPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ x: string; y: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    urgencyLevel: "",
    status: "נפתח",
    fileImage: null as File | null,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("📍 אין מיקום זמין עדיין");
      return;
    }

    setIsLoading(true);
    
    const data = new FormData();
   
    data.append("Status", formData.status);
    data.append("LocationX", Number(location.x).toString());
    data.append("LocationY", Number(location.y).toString());
   data.append("UrgencyLevel", Number(formData.urgencyLevel).toString());
    data.append("Date", new Date().toISOString());


    if (formData.description) data.append("Description", formData.description);
    if (formData.fileImage) data.append("FileImage", formData.fileImage);

    try {
      await createCall(data);
      let guides = [];
      if (formData.description) {
        const response = await getFirstAidInstructions(formData.description);
        guides = response.data;
      }
      navigate("/call-confirmation", { state: { guides } });
    } catch {
      alert("❌ שגיאה בשליחה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <div className="create-call-container">
        <h2 className="page-title">🚨 פתיחת קריאה</h2>
        
        <form onSubmit={handleSubmit} className="form">
          <textarea
            name="description"
            placeholder="תיאור המצב (לא חובה) - תאר מה קרה בקצרה"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="form-textarea"
          />
          
          <input
            name="urgencyLevel"
            placeholder="רמת דחיפות: דחוף / בינוני / נמוך (לא חובה)"
            value={formData.urgencyLevel}
            onChange={handleChange}
            type="text"
          />
          
          <div className="file-upload-container">
            <input 
              type="file" 
              name="fileImage" 
              onChange={handleChange}
              accept="image/*"
            />
            <small className="file-help-text">
              📸 אפשר לצרף תמונה להמחשת המצב
            </small>
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                שולח קריאה...
              </>
            ) : (
              "📤 שלח קריאה רגילה"
            )}
          </button>
        </form>
      </div>
    </BackgroundLayout>
  );
}