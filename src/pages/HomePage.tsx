import { useNavigate } from "react-router";
import BackgroundLayout from "../layouts/BackgroundLayout";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <BackgroundLayout>
      <h1>הורידו כעת את האפליקציה</h1>
      <p>הירשמו עכשיו כדי שתוכלו בזמן אמת להציל חיים</p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={() => navigate("/register-user")}>להרשמה</button>
        <button onClick={() => navigate("/register-volunteer")}>הירשם כמתנדב</button>
        {/* <button onClick={() => navigate("/create-call")}>פתח קריאת חירום</button> */}
        <button onClick={() => navigate("/VolunteerListPage")}>צפה במתנדבים</button>
      </div>
    </BackgroundLayout>
  );
}
