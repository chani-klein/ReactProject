import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { createCall } from "../services/calls.service";

export default function CreateCallPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    locationX: "",
    locationY: "",
    description: "",
    urgencyLevel: "",
    status: "נפתח",
    fileImage: null as File | null,
  });

  // קבלת מיקום GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          locationX: pos.coords.latitude.toString(),
          locationY: pos.coords.longitude.toString(),
        }));
      },
      () => alert("לא הצלחנו לאתר מיקום")
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

  // שליחה רגילה של טופס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("LocationX", formData.locationX);
    data.append("LocationY", formData.locationY);
    data.append("Status", formData.status);
    if (formData.description) data.append("Description", formData.description);
    if (formData.urgencyLevel) data.append("UrgencyLevel", formData.urgencyLevel);
    if (formData.fileImage) data.append("FileImage", formData.fileImage);

    try {
      await createCall(data);
      alert("הקריאה נשלחה");
      navigate("/home");
    } catch (err) {
      alert("שגיאה בשליחה");
    }
  };

  // לחצן SOS
  const handleSosClick = async () => {
    const data = new FormData();
    data.append("LocationX", formData.locationX);
    data.append("LocationY", formData.locationY);
    data.append("Status", "נפתח");

    try {
      await createCall(data);
      alert("קריאת SOS נשלחה");
      navigate("/home");
    } catch (err) {
      alert("שגיאה בשליחת SOS");
    }
  };

  return (
    <BackgroundLayout>
      <div style={{ position: "relative", width: "100%" }}>
        <form onSubmit={handleSubmit} className="form">
          <h2>פתיחת קריאה</h2>
          <input name="description" placeholder="תיאור (לא חובה)" onChange={handleChange} />
          <input name="urgencyLevel" placeholder="רמת דחיפות (לא חובה)" onChange={handleChange} />
          <input type="file" name="fileImage" onChange={handleChange} />
          <button type="submit">שלח</button>
        </form>

        <button
          onClick={handleSosClick}
          type="button"
          style={{
            position: "absolute",
            bottom: "-30px",
            right: "0",
            backgroundColor: "#d80000",
            color: "white",
            borderRadius: "50%",
            border: "none",
            width: "80px",
            height: "80px",
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          }}
        >
          SOS
        </button>
      </div>
    </BackgroundLayout>
  );
}
