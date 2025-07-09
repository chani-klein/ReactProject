import { useEffect, useState } from "react";
import ActiveCallCard from '../../components/ActiveCallCard';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import LoadingContainer from "../../components/LoadingContainer";
import ErrorContainer from  '../../components/ErrorContainer';
import { getActiveCalls } from '../../services/volunteer.service';
import type { Call } from '../../types/call.types';

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveCalls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // שליפת קריאות פעילות למתנדב הנוכחי
      const res = await getActiveCalls();
      // טיפול במיפוי id במקרה שהשדה מגיע בשם אחר (למשל callId)
      const callsWithId = res.data.map((call: any) => ({ ...call, id: call.id || call.callId || call.callsId }));
      console.log("callsWithId", callsWithId);
      setActiveCalls(callsWithId);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת קריאות פעילות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActiveCalls();
  }, []);

  // רענון קריאות לאחר עדכון סטטוס
  const handleStatusUpdate = () => {
    loadActiveCalls();
  };

  if (isLoading) {
    return (
      <BackgroundLayout>
        <LoadingContainer message="טוען קריאות פעילות..." />
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout>
        <ErrorContainer message={error} onRetry={loadActiveCalls} />
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="calls-container">
        {activeCalls.length === 0 ? (
          <div>אין קריאות פעילות כרגע</div>
        ) : (
          activeCalls.map((call) => {
            const volunteerStatus = call.volunteersStatus?.[0]?.response || 'לא זמין';
            const volunteerId = call.volunteersStatus?.[0]?.volunteerId || 0;

            const mappedCall = {
              ...call,
              address: call.address || 'כתובת לא זמינה',
              priority: call.priority || 'נמוך',
              timestamp: call.createdAt || new Date().toISOString(),
              type: call.type || 'חירום',
            };

            return (
              <ActiveCallCard
                key={call.id}
                volunteerCall={{
                  call: mappedCall,
                  callsId: call.id,
                  volunteerId,
                  volunteerStatus,
                  responseTime: call.createdAt,
                  goingVolunteersCount: call.goingVolunteersCount || 0,
                }}
                onStatusUpdate={handleStatusUpdate}
                showArrivedOnly={volunteerStatus === 'going'}
              />
            );
          })
        )}
      </div>
    </BackgroundLayout>
  );
}