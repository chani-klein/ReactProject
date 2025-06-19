import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { createCall, getFirstAidInstructions } from "../services/calls.service";

export default function CreateCallPage() {
  const navigate = useNavigate();

  const [location, setLocation] = useState<{ x: string; y: string } | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      alert("אין מיקום זמין עדיין");
      return;
    }

    const data = new FormData();
    data.append("LocationX", location.x);
    data.append("LocationY", location.y);
    data.append("Status", formData.status);
    if (formData.description) data.append("Description", formData.description);
    if (formData.urgencyLevel) data.append("UrgencyLevel", formData.urgencyLevel);
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
    }
  };

  const sendSosCall = async () => {
    if (!location) {
      alert("אין מיקום זמין עדיין");
      return;
    }

    const data = new FormData();
    data.append("LocationX", location.x);
    data.append("LocationY", location.y);
    data.append("Status", "נפתח");
    data.append("Description", "קריאת SOS");

    try {
      await createCall(data);
      alert("📢 קריאת SOS נשלחה");
      navigate("/call-confirmation");
    } catch {
      alert("❌ שגיאה בשליחת קריאת SOS");
    }
  };

  return (
    <BackgroundLayout>
      <h2 style={{ textAlign: "center" }}>🚨 פתיחת קריאה</h2>

   

      <form onSubmit={handleSubmit} className="form">
        <input
          name="description"
          placeholder="תיאור (לא חובה)"
          onChange={handleChange}
        />
        <input
          name="urgencyLevel"
          placeholder="רמת דחיפות (לא חובה)"
          onChange={handleChange}
        />
        <input type="file" name="fileImage" onChange={handleChange} />
        <button type="submit">📤 שלח קריאה רגילה</button>
      </form>
    </BackgroundLayout>
  );
}
