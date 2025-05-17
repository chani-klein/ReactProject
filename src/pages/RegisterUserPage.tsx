import { useState } from "react";
import { registerUser } from "../services/auth.service";
import FormLayout from "../components/FormLayout";

export default function RegisterUserPage() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gmail: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerUser(user);
      console.log("נרשם בהצלחה", res.data);
      alert("ההרשמה הצליחה!");
    } catch (err) {
      console.error(err);
      alert("שגיאה בהרשמה");
    }
  };

  return (
    <FormLayout title="טופס הרשמה למשתמשים" onSubmit={handleSubmit}>
      <input name="firstName" placeholder="שם פרטי" onChange={handleChange} />
      <input name="lastName" placeholder="שם משפחה" onChange={handleChange} />
      <input name="phoneNumber" placeholder="טלפון" onChange={handleChange} />
      <input name="gmail" placeholder="אימייל" onChange={handleChange} />
      <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} />
    </FormLayout>
  );
}
