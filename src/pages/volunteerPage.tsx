// ✅ VolunteerMenu.tsx - תפריט צד של מתנדב
import { Link } from "react-router-dom";
import BackgroundLayout from "../layouts/BackgroundLayout";
export default function VolunteerMenu() {
  return (
     <BackgroundLayout>
    <nav className="volunteer-menu">
      <ul>
        <li><Link to="/volunteer/active-calls">📡 קריאות פעילות</Link></li>
        <li><Link to="/volunteer/history">📖 היסטוריית קריאות</Link></li>
        <li><Link to="/volunteer/update-details">⚙ עדכון פרטים אישיים</Link></li>
      </ul>
    </nav>
    </BackgroundLayout>
  );
}
