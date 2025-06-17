// VolunteerUpdatePage.tsx

import { useEffect, useState } from "react";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { getSession } from "../services/auth.utils";
import { getVolunteerById, updateVolunteer } from "../services/volunteer.service";

export default function VolunteerUpdatePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [volunteerId, setVolunteerId] = useState<number | null>(null);

  useEffect(() => {
    const token = getSession();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = Number(payload["nameid"]);
      setVolunteerId(id);
    } catch (err) {
      console.error("בעיה בפיענוח הטוקן", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!volunteerId) return;
      try {
        const res = await getVolunteerById(volunteerId);
        setFormData(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת מתנדב:", err);
      }
    };
    load();
  }, [volunteerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerId) return;
    try {
      await updateVolunteer(volunteerId, formData);
      alert("✨ פרטים עודכנו בהצלחה");
    } catch (err) {
      alert("שגיאה בעדכון");
    }
  };

  return (
    <BackgroundLayout>
      <h2>⚙ עדכון פרטים אישיים</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="שם מלא" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="טלפון" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="עיר" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="כתובת" />
        <button type="submit">שמור</button>
      </form>
    </BackgroundLayout>
  );
}
