import { useNavigate } from "react-router";
import BackgroundLayout from "../layouts/BackgroundLayout";


export default function EmergencyPage() {
  const navigate = useNavigate();

  return (
    <BackgroundLayout>
      <button className="emergency-btn" onClick={() => navigate("/CreateCallPage")}>
        פתח קריאת חירום
      </button>
    </BackgroundLayout>
  );
}
