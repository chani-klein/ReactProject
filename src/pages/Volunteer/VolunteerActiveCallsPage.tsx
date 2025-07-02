'use client';
import { useEffect, useState } from 'react';
import ActiveCallCard from '../../components/ActiveCallCard';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import { getActiveCalls, updateVolunteerStatus, completeCall } from '../../services/volunteer.service';
import { getVolunteerDetails } from '../../services/volunteer.service';
import type { Call } from '../../types/call.types';

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveCalls = async () => {
    const volunteerId = await getVolunteerDetails();
    if (!volunteerId) {
      console.error('❌ volunteerId לא תקין');
      alert('אנא התחבר מחדש למערכת');
      return;
    }

    setIsLoading(true);
    try {
      const res = await getActiveCalls(volunteerId);
      setActiveCalls(res.data);
    } catch (err) {
      console.error('❌ שגיאה בטעינת קריאות פעילות:', err);
      setActiveCalls([]);
      alert('שגיאה בטעינת קריאות פעילות');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVolunteerStatus = async (callId: number, newStatus: 'going' | 'arrived' | 'finished', summary?: string) => {
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');

      if (newStatus === 'finished') {
        await completeCall(callId, summary || '');
        setActiveCalls((prev) => prev.filter((call) => call.id !== callId));
      } else {
        await updateVolunteerStatus(callId, newStatus);
        setActiveCalls((prev) =>
          prev.map((call) =>
            call.id === callId ? { ...call, volunteersStatus: [{ volunteerId, response: newStatus }] } : call
          )
        );
      }
    } catch (err) {
      console.error('❌ שגיאה בעדכון סטטוס מתנדב:', err);
      alert('שגיאה בעדכון הסטטוס, נסה שוב');
    }
  };

  useEffect(() => {
    fetchActiveCalls();
  }, []);

  return (
    <BackgroundLayout>
      <div className="page-header">
        <h2 style={{ textAlign: 'center' }}>📡 קריאות פעילות</h2>
        <button
          onClick={fetchActiveCalls}
          className="btn btn-secondary"
          style={{ margin: '1rem auto', display: 'block' }}
          disabled={isLoading}
        >
          {isLoading ? '🔄 טוען...' : '🔄 רענן רשימה'}
        </button>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>🔄 טוען קריאות פעילות...</p>
        </div>
      )}

      {!isLoading && activeCalls.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>🔍 אין קריאות פעילות כרגע</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            הקריאות שתקבל יופיעו כאן אחרי שתלחץ "אני יוצא"
          </p>
        </div>
      )}

      {!isLoading &&
        activeCalls.map((call) => (
          <ActiveCallCard key={call.id} call={call} onStatusUpdate={updateVolunteerStatus} />
        ))}
    </BackgroundLayout>
  );
}