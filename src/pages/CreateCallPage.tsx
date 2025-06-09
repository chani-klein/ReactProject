import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { createCall, getFirstAidInstructions } from "../services/calls.service";

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          locationX: pos.coords.latitude.toString(),
          locationY: pos.coords.longitude.toString(),
        }));
      },
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
    const data = new FormData();
    data.append("LocationX", formData.locationX);
    data.append("LocationY", formData.locationY);
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
    } catch (err) {
      alert("❌ שגיאה בשליחה");
    }
  };

  return (
    <BackgroundLayout>
      <form onSubmit={handleSubmit} className="form">
        <h2>פתיחת קריאה</h2>
        <input name="description" placeholder="תיאור (לא חובה)" onChange={handleChange} />
        <input name="urgencyLevel" placeholder="רמת דחיפות (לא חובה)" onChange={handleChange} />
        <input type="file" name="fileImage" onChange={handleChange} />
        <button type="submit">שלח</button>
      </form>
    </BackgroundLayout>
  );
}
