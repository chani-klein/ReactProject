'use client';
import { useState, useEffect } from 'react';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import CloseCallForm from '../../components/CloseCallForm';
import { getVolunteerHistory } from '../../services/volunteer.service';
import { getVolunteerDetails } from '../../services/volunteer.service';
import type { Call } from '../../types/call.types';
export default function HistoryPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      const res = await getVolunteerHistory();
      setCalls(res.data);
    } catch (error) {
      console.error('Error fetching calls:', error);
      alert('שגיאה בטעינת היסטוריית קריאות');
    } finally {
      setLoading(false);
    }
  };

  const closeCall = async (id: number, summary: string) => {
    try {
   
      await fetchCalls();
    } catch (error) {
      console.error('Error closing call:', error);
      alert('שגיאה בסיום הקריאה, נסה שוב');
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  return (
    <BackgroundLayout>
      <h2>📖 היסטוריית קריאות</h2>
      {loading && <p>טוען...</p>}
      {!loading && calls.length === 0 && <p>אין קריאות להצגה.</p>}
      {calls.map((call) => (
        <div key={call.id} className="card">
          <h3>{call.description}</h3>
          <p>סטטוס: {call.status}</p>
          {call.status === 'Closed' ? (
            <p>📝 דו״ח: {call.summary || 'לא נרשם דו"ח'}</p>
          ) : (
            <CloseCallForm onSubmit={(summary) => closeCall(call.id, summary)} />
          )}
        </div>
      ))}
    </BackgroundLayout>
  );
}