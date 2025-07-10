import { useEffect, useState } from "react";
import ActiveCallCard from '../../components/ActiveCallCard';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import LoadingContainer from "../../components/LoadingContainer";
import ErrorContainer from '../../components/ErrorContainer';
import { getActiveCalls } from '../../services/volunteer.service';
import type { VolunteerCall } from '../../types/volunteerCall.types';
import '../../layouts/VolunteerActiveCallsPage.css';

export default function VolunteerActiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<VolunteerCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveCalls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getActiveCalls();
      const callsWithMappedData = res.data.map((call: any) => ({
        callsId: call.callsId,
        volunteerId: call.volunteerId,
        volunteerStatus: call.volunteerStatus,
        responseTime: call.responseTime,
        call: {
          id: call.call.id,
          locationX: call.call.locationX,
          locationY: call.call.locationY,
          arrImage: call.call.arrImage,
          date: call.call.date,
          fileImage: call.call.fileImage,
          description: call.call.description,
          urgencyLevel: call.call.urgencyLevel,
          status: call.call.status,
          summary: call.call.summary,
          sentToHospital: call.call.sentToHospital,
          hospitalName: call.call.hospitalName,
          userId: call.call.userId,
          address: call.call.address || 'כתובת לא זמינה',
          priority: call.call.priority || 'נמוך',
          timestamp: call.call.timestamp || new Date().toISOString(),
          type: call.call.type || 'חירום',
        },
        goingVolunteersCount: call.goingVolunteersCount,
      }));

      setActiveCalls(callsWithMappedData);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת קריאות פעילות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActiveCalls();
  }, []);

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
      <div className="active-calls-page">
        <div className="page-header">
          <h1 className="page-title">🚨 קריאות פעילות</h1>
          <p className="page-subtitle">מעקב אחר כל הקריאות הפעילות במערכת</p>
          <button 
            className="refresh-btn"
            onClick={loadActiveCalls}
            disabled={isLoading}
          >
            🔄 רענן רשימה
          </button>
        </div>

        <div className="calls-stats">
          <div className="stat-card">
            <div className="stat-number">{activeCalls.length}</div>
            <div className="stat-label">קריאות פעילות</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{activeCalls.filter(call => call.volunteerStatus === 'going').length}</div>
            <div className="stat-label">מתנדבים בדרך</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{activeCalls.filter(call => call.call.urgencyLevel >= 3).length}</div>
            <div className="stat-label">דחופות</div>
          </div>
        </div>

        <div className="calls-container-modern">
          {activeCalls.length === 0 ? (
            <div className="no-calls-message-modern">
              <div className="no-calls-icon">📋</div>
              <h3>אין קריאות פעילות כרגע</h3>
              <p>כל הקריאות טופלו או שאין קריאות חדשות</p>
            </div>
          ) : (
            <div className="calls-grid-modern">
              {activeCalls.map((call) => (
                <ActiveCallCard
                  key={call.callsId}
                  volunteerCall={call}
                  onStatusUpdate={handleStatusUpdate}
                  showArrivedOnly={call.volunteerStatus === 'going'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BackgroundLayout>
  );
}