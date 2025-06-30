import React, { useEffect, useState } from 'react';
import { getNearbyCalls } from '../services/volunteer.service'; // התאם את הנתיב
import { jwtDecode } from 'jwt-decode'; // ייבוא נכון של jwt-decode
import type { Call } from '../types/call.types'; // התאם את הנתיב

interface JwtPayload {
  nameid: string; // תואם ל-ClaimTypes.NameIdentifier
}

const VolunteerCallWatcher: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getVolunteerId = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('אנא התחבר מחדש');
      return null;
    }
    try {
      const decoded: JwtPayload = jwtDecode(token); // תיקון הייבוא
      return parseInt(decoded.nameid);
    } catch (err) {
      setError('שגיאה בקריאת פרטי משתמש');
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setError('אנא התחבר כדי לראות קריאות קרובות');
      return;
    }

    const fetchCalls = async () => {
      const volunteerId = getVolunteerId();
      if (!volunteerId) return;

      try {
        const response = await getNearbyCalls(volunteerId);
        setCalls(response.data);
        setError(null);
      } catch (err: any) {
        let errorMessage = 'שגיאה באיתור קריאות';
        if (err.response?.status === 404) {
          errorMessage = 'מתנדב לא נמצא או אין קריאות קרובות';
        } else if (err.response?.status === 400) {
          errorMessage = 'למתנדב אין מיקום מוגדר';
        } else {
          errorMessage = err.response?.data?.error || err.message;
        }
        setError(errorMessage);
        console.error('שגיאה באיתור קריאות:', err);
      }
    };

    if (isAuthenticated) {
      fetchCalls();
      const interval = setInterval(fetchCalls, 30000); // עדכון כל 30 שניות
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {calls.length === 0 && !error ? (
        <p>אין קריאות קרובות זמינות</p>
      ) : (
        <ul>
          {calls.map((call) => (
            <li key={call.id}>
              קריאה #{call.id} - סטטוס: {call.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VolunteerCallWatcher;