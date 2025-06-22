import { useEffect, useState } from "react";
import { getVolunteers } from "../../services/volunteer.service";
import BackgroundLayout from "../../layouts/BackgroundLayout";

type Volunteer = {
  id: number;
  fullName: string;
  gmail: string;
  phoneNumber: string;
  specialization: string;
  city: string;
};

export default function VolunteerListPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await getVolunteers();
        setVolunteers(res.data);
      } catch (err: any) {
        setError("שגיאה בטעינת מתנדבים");
        console.error(err);
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <BackgroundLayout>
      <h2 style={{ textAlign: "center" }}>📋 רשימת מתנדבים</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {volunteers.map((v) => (
          <div key={v.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "10px" }}>
            <h3>{v.fullName}</h3>
            <p>📧 {v.gmail}</p>
            <p>📞 {v.phoneNumber}</p>
            <p>🩺 {v.specialization}</p>
            <p>🏙️ {v.city}</p>
          </div>
        ))}
      </div>
    </BackgroundLayout>
  );
}
