import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import { createCall, getFirstAidSuggestions } from "../../services/calls.service";
import "../../style/emergency-styles.css";

export default function CreateCallPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ x: string; y: string } | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    urgencyLevel: "",
    status: "Open",
    fileImage: null as File | null,
    address: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude.toString();
        const longitude = pos.coords.longitude.toString();
        setLocation({ x: latitude, y: longitude });

        try {
          const address = await import("../../services/firstAid.service").then((m) =>
            m.getAddressFromCoords(Number(latitude), Number(longitude))
          );
          setFormData((prev) => ({ ...prev, address }));
        } catch (err) {
          console.error("שגיאה בזיהוי כתובת:", err);
          setFormData((prev) => ({ ...prev, address: "כתובת לא זמינה" }));
        }
      },
      (err) => {
        console.error("⚠️ שגיאה באיתור מיקום:", err);
        alert("⚠️ לא הצלחנו לאתר את מיקומך, נסה שוב או הזן כתובת ידנית");
      }
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      alert("📍 לא ניתן לשלוח קריאה ללא מיקום");
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("Status", formData.status);
    data.append("UrgencyLevel", Number(formData.urgencyLevel).toString());
    data.append("CreatedAt", new Date().toISOString());
    data.append("LocationX", location.y); // longitude
    data.append("LocationY", location.x); // latitude

    if (formData.description) data.append("Description", formData.description);
    if (formData.fileImage) data.append("FileImage", formData.fileImage);
    if (formData.address) data.append("Address", formData.address);

    try {
      const response = await createCall(data);
      const callId = (response.data as any).id || (response.data as any).callId;
      if (!callId) throw new Error("לא התקבל מזהה קריאה מהשרת");
    //  let guides = [];
      // if (formData.description) {
      //   const res = await getFirstAidSuggestions(formData.description);
      //   guides = res.data;
      // }
      navigate(`/call-confirmation/${callId}`, { state: { callId, description: formData.description } });
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

          <select
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">בחר רמת דחיפות</option>
            <option value="1">נמוכה</option>
            <option value="2">בינונית</option>
            <option value="3">גבוהה</option>
            <option value="4">קריטית</option>
          </select>

          <div className="file-upload-container">
            <input
              type="file"
              name="fileImage"
              onChange={handleChange}
              accept="image/*"
            />
            <small className="file-help-text">📸 אפשר לצרף תמונה להמחשת המצב</small>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                שולח קריאה...
              </>
            ) : (
              "📤 שלח קריאה"
            )}
          </button>
        </form>
      </div>
    </BackgroundLayout>
  );
}
