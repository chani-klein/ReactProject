import { useState, useEffect } from 'react';
import ActiveCallCard from '../../components/ActiveCallCard';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import { getActiveCalls, updateVolunteerStatus } from '../../services/volunteer.service';
import type { Call } from '../../types/call.types';

const getVolunteerDetails = async () => {
  // implement this function to get the volunteer details
};

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActiveCalls();
  }, []);

  const loadActiveCalls = async () => {
    setIsLoading(true);
    try {
      const res = await getActiveCalls();
      setActiveCalls(res.data);
    } catch (err) {
      console.error("❌ שגיאה בטעינת קריאות פעילות:", err);
      setError("שגיאה בטעינת קריאות פעילות");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (callId: number, status: "going" | "arrived" | "finished", summary?: string) => {
    try {
      await updateVolunteerStatus(callId, status);
      await loadActiveCalls();
    } catch (err) {
      console.error("❌ שגיאה בעדכון סטטוס:", err);
      alert("שגיאה בעדכון הסטטוס");
    }
  };

  const handleCompleteCall = async (callId: number, summary: string) => {
    try {
     
      await loadActiveCalls();
    } catch (err) {
      console.error("❌ שגיאה בסיום קריאה:", err);
      alert("שגיאה בסיום הקריאה");
    }
  };

  if (isLoading) {
    return (
            <BackgroundLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>טוען קריאות פעילות...</p>
        </div>
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadActiveCalls} className="retry-button">
            נסה שוב
          </button>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="calls-container">
        {activeCalls.map((call, idx) => (
          <ActiveCallCard
            key={call.id ?? idx}
            call={call}
            onStatusUpdate={handleStatusUpdate}
         
          />
        ))}
      </div>
    </BackgroundLayout>
  );
}