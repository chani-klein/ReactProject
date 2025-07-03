import React, { useEffect, useState } from 'react';
import { getAssignedCalls } from '../services/calls.service';
import { jwtDecode } from 'jwt-decode'; // ייבוא נכון של jwt-decode
import type { Call } from '../types/call.types'; // התאם את הנתיב
import { useCallContext } from '../contexts/CallContext';

interface JwtPayload {
  nameid: string; // תואם ל-ClaimTypes.NameIdentifier
}

const VolunteerCallWatcher: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { setPopupCall, popupCall } = useCallContext();
  const [lastCallId, setLastCallId] = useState<number | null>(null);

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
      setError('אנא התחבר כדי לראות קריאות מוקצות');
      return;
    }

    const fetchCalls = async () => {
      const volunteerId = getVolunteerId();
      if (!volunteerId) return;

      try {
        // שליפת קריאות מוקצות למתנדב
        const assignedCalls = await getAssignedCalls(volunteerId);
        setCalls(assignedCalls);
        setError(null);
        // פופאפ קריאה חדשה לפי הקריאות המוקצות
        if (assignedCalls && assignedCalls.length > 0) {
          // מצא קריאה חדשה שלא הייתה קודם (id שלא קיים ב-calls)
          const newCall = assignedCalls.find((call: Call) => !calls.some((c: Call) => c.id === call.id));
          if (newCall) {
            setPopupCall(newCall);
            setLastCallId(newCall.id);
          }
        }
      } catch (err: any) {
        let errorMessage = 'שגיאה באיתור קריאות';
        if (err.response?.status === 404) {
          errorMessage = 'לא נמצאו קריאות מוקצות';
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
      const interval = setInterval(fetchCalls, 5000); // עדכון כל 5 שניות
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, lastCallId, setPopupCall]);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {calls.length === 0 && !error ? (
        <p>אין קריאות מוקצות זמינות</p>
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