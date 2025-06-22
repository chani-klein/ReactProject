import { Link } from "react-router-dom";
import BackgroundLayout from "../../layouts/BackgroundLayout";


export default function VolunteerMenu() {
  return (
    <BackgroundLayout>
      <div className="volunteer-menu-container">
        <h1 className="menu-title">תפריט מתנדב</h1>
        <div className="menu-grid">
          <Link to="/volunteer/active-calls" className="menu-card">
            <div className="card-icon">📡</div>
            <div className="card-title">קריאות פעילות</div>
            <div className="card-subtitle">צפה בקריאות חירום פעילות</div>
          </Link>
          
          <Link to="/volunteer/history" className="menu-card">
            <div className="card-icon">📖</div>
            <div className="card-title">היסטוריית קריאות</div>
            <div className="card-subtitle">עיין בקריאות קודמות</div>
          </Link>
          
          <Link to="/volunteer/update-details" className="menu-card">
            <div className="card-icon">⚙️</div>
            <div className="card-title">עדכון פרטים אישיים</div>
            <div className="card-subtitle">עדכן את הפרטים שלך</div>
          </Link>
        </div>
      </div>
    </BackgroundLayout>
  );
}