import { useState } from "react";
import { registerUser } from "../services/auth.service";
import FormLayout from "../components/FormLayout";
import BackgroundLayout from "../layouts/BackgroundLayout";
import { useNavigate } from "react-router-dom";
import { setSession } from "../services/auth.utils";
import { Paths } from "../routes/paths";

export default function RegisterUserPage() {
  const navigate = useNavigate();

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
      console.log("🔍 res.data =", res.data); // ✅ בדיקה של מה באמת חוזר מהשרת
console.log("🔍 כל מה שמחזיר השרת:", res.data);

      const { token } = res.data;
      if (token) {
        setSession(token);
        alert("ההרשמה הצליחה!");
        navigate(`/${Paths.userHome}`);
      } else {
        alert("❗לא התקבל טוקן מהשרת");
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה בהרשמה");
    }
  };

  return (
    <BackgroundLayout>
      <FormLayout title="טופס הרשמה למשתמשים" onSubmit={handleSubmit}>
        <input name="firstName" placeholder="שם פרטי" onChange={handleChange} />
        <input name="lastName" placeholder="שם משפחה" onChange={handleChange} />
        <input name="phoneNumber" placeholder="טלפון" onChange={handleChange} />
        <input name="gmail" placeholder="אימייל" onChange={handleChange} />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} />
      </FormLayout>
    </BackgroundLayout>
    
  );
}
