import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSession } from "../services/auth.utils";
import BackgroundLayout from "../layouts/BackgroundLayout";
import FormLayout from "../components/FormLayout";
import { Paths } from "../routes/paths";
import axios from "../services/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/Person/login", { email, password });
      const { token, role } = res.data;
      setSession(token);

      // הפניה לפי תפקיד
      if (role === "User") navigate(`/${Paths.userHome}`);
      else if (role === "Volunteer") navigate(`/${Paths.volunteerHome}`);
      else navigate("/");
    } catch (err) {
      alert("התחברות נכשלה");
      console.error(err);
    }
  };

  return (
    <BackgroundLayout>
      <FormLayout title="התחברות" onSubmit={handleSubmit}>
        <input
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormLayout>
    </BackgroundLayout>
  );
}
