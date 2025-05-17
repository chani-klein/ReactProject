import { useState } from "react";
import { registerVolunteer } from "../services/volunteer.service";
import "../style/registerVolunteer.css";

export default function RegisterVolunteerPage() {
  const [volunteer, setVolunteer] = useState({
    fullName: "",
    gmail: "",
    password: "",
    phoneNumber: "",
    specialization: "",
    address: "",
    city: "",

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolunteer({ ...volunteer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = Object.values(volunteer).every((value) => value.trim() !== "");
    if (!isValid) {
      alert("אנא מלא את כל השדות בטופס!");
      return;
    }

    try {
      const res = await registerVolunteer(volunteer);
      console.log("ההרשמה הצליחה", res.data);
      alert("נרשמת בהצלחה כמתנדב!");
    } catch (err: any) {
      if (err.response) {
        console.error("שגיאת שרת:", err.response.data);
        alert("שגיאה: " + JSON.stringify(err.response.data));
      } else {
        console.error(err);
        alert("שגיאה לא צפויה בהרשמה");
      }
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>טופס הרשמה למתנדבים</h2>
        <input name="fullName" placeholder="שם מלא" onChange={handleChange} />
        <input name="gmail" placeholder="אימייל" onChange={handleChange} />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} />
        <input name="phoneNumber" placeholder="טלפון" onChange={handleChange} />
        <input name="specialization" placeholder="תחום (חובש/עזרה ראשונה...)" onChange={handleChange} />
        <input name="address" placeholder="כתובת" onChange={handleChange} />
        <input name="city" placeholder="עיר" onChange={handleChange} />
    

        <button type="submit">שלח</button>
      </form>
    </div>
  );
}
