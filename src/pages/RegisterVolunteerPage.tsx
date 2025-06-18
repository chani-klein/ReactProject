import { useState } from "react";
import { registerVolunteer } from "../services/volunteer.service";
import FormLayout from "../components/FormLayout";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { useNavigate } from "react-router-dom";
import { setSession } from "../services/auth.utils";
import { Paths } from "../routes/paths";

export default function RegisterVolunteerPage() {
  const navigate = useNavigate();

  const [volunteer, setVolunteer] = useState({
    fullName: "",
    gmail: "",
    password: "",
    phoneNumber: "",
    specialization: "",
    address: "",
    city: "",
     role: "Volunteer",
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
      const { token } = res.data;
      setSession(token);
      alert("נרשמת בהצלחה כמתנדב!");
      navigate(`/${Paths.volunteerHome}`);
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
    <BackgroundLayout>
      <FormLayout title="טופס הרשמה למתנדבים" onSubmit={handleSubmit}>
        <input name="fullName" placeholder="שם מלא" onChange={handleChange} />
        <input name="gmail" placeholder="אימייל" onChange={handleChange} />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} />
        <input name="phoneNumber" placeholder="טלפון" onChange={handleChange} />
        <input name="specialization" placeholder="תחום (חובש/עזרה ראשונה...)" onChange={handleChange} />
        <input name="address" placeholder="כתובת" onChange={handleChange} />
        <input name="city" placeholder="עיר" onChange={handleChange} />
      </FormLayout>
    </BackgroundLayout>
  );
}
