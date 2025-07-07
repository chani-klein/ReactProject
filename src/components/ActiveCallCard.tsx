'use client';
import { useState, useEffect } from 'react';
import CloseCallForm from './CloseCallForm';
import { updateVolunteerStatus, completeCall, getCallVolunteersInfo, respondToCall } from '../services/volunteer.service';
import { getVolunteerDetails } from '../services/volunteer.service';
import { getAddressFromCoords } from '../services/firstAid.service';
import type { Call, VolunteerStatus } from '../types/call.types';

interface ActiveCallCardProps {
  call: Call;
  onStatusUpdate: () => void;
  showArrivedOnly?: boolean;
}

export default function ActiveCallCard({ call, onStatusUpdate, showArrivedOnly }: ActiveCallCardProps) {
  const [address, setAddress] = useState<string>('');
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<string>('notified');
  const [goingVolunteersCount, setGoingVolunteersCount] = useState<number>(call.goingVolunteersCount || 0);

  useEffect(() => {
    if (call.locationX && call.locationY) {
      getAddressFromCoords(call.locationY, call.locationX)
        .then(setAddress)
        .catch(() => setAddress('כתובת לא זמינה'));
    } else {
      setAddress('כתובת לא זמינה');
    }
    const fetchGoingCount = async () => {
      try {
        const info = await getCallVolunteersInfo(call.id);
        setGoingVolunteersCount(info.data.goingVolunteersCount);
      } catch (err) {
        setGoingVolunteersCount(0);
      }
    };
    fetchGoingCount();
  }, [call]);

  useEffect(() => {
    const fetchVolunteerStatus = async () => {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) return;
      const statusObj = call.volunteersStatus?.find((v: VolunteerStatus) => v.volunteerId === volunteerId);
      if (statusObj) {
        setVolunteerStatus(statusObj.response);
      }
    };
    fetchVolunteerStatus();
  }, [call.volunteersStatus]);

  const handleStatusUpdate = async (newStatus: 'going' | 'arrived' | 'finished') => {
    setIsLoading(true);
    try {
      await updateVolunteerStatus(call.id, newStatus);
      setVolunteerStatus(newStatus);
      onStatusUpdate();
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  // בשימוש בכפתור "לא יכול" יש להפעיל את respondToCall במקום updateVolunteerStatus
  const handleCant = async () => {
    setIsLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      await respondToCall(call.id, 'cant');
      setVolunteerStatus('cant');
      onStatusUpdate();
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteCall = async (summary: { summary: string; sentToHospital: boolean; hospitalName?: string }) => {
    setIsLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      await completeCall(call.id, volunteerId, summary);
      setShowCloseForm(false);
      setVolunteerStatus('finished');
      onStatusUpdate();
    } catch (error) {
      alert('שגיאה בסיום הקריאה, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="card-header">
        <h3 style={{ margin: 0 }}>{call.description}</h3>
        <span
          style={{
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
          }}
        >
          {volunteerStatus === 'notified' && 'קריאה חדשה'}
          {volunteerStatus === 'going' && 'בדרך'}
          {volunteerStatus === 'arrived' && 'הגעתי'}
          {volunteerStatus === 'finished' && 'הושלם'}
          {volunteerStatus === 'cant' && 'לא יכול'}
        </span>
      </div>
      <div className="card-body">
        <p><strong>🚨 דחיפות:</strong> {call.urgencyLevel ?? "לא זמין"}</p>
        <p><strong>📍 כתובת:</strong> {address || "לא זמין"}</p>
        <p><strong>⏰ זמן:</strong> {call.createdAt ? new Date(call.createdAt).toLocaleString('he-IL') : "לא זמין"}</p>
        <p><strong>🚗 מתנדבים בדרך:</strong> {goingVolunteersCount ?? 0}</p>
        {call.imageUrl && (
          <div style={{ margin: '1rem 0' }}>
            <img src={call.imageUrl} alt="תמונת הקריאה" style={{ maxWidth: '200px', borderRadius: '4px' }} />
          </div>
        )}
      </div>
      <div className="card-actions">
        {showArrivedOnly ? (
          volunteerStatus === 'going' && (
            <button className="btn btn-warning" onClick={() => handleStatusUpdate('arrived')} disabled={isLoading}>
              {isLoading ? 'מעדכן...' : 'הגעתי'}
            </button>
          )
        ) : (
          <>
            {volunteerStatus === 'notified' && (
              <>
                <button className="btn btn-success" onClick={() => handleStatusUpdate('going')} disabled={isLoading}>
                  {isLoading ? 'מעדכן...' : 'אני יוצא'}
                </button>
                <button className="btn btn-danger" onClick={handleCant} disabled={isLoading}>
                  {isLoading ? 'מעדכן...' : 'לא יכול'}
                </button>
              </>
            )}
            {volunteerStatus === 'going' && (
              <button className="btn btn-warning" onClick={() => handleStatusUpdate('arrived')} disabled={isLoading}>
                {isLoading ? 'מעדכן...' : 'הגעתי'}
              </button>
            )}
            {volunteerStatus === 'arrived' && (
              <button className="btn btn-info" onClick={() => setShowCloseForm(true)} disabled={isLoading}>
                {isLoading ? 'מעדכן...' : 'סגור קריאה'}
              </button>
            )}
            {showCloseForm && (
              <CloseCallForm
                onSubmit={handleCompleteCall}
                onCancel={() => setShowCloseForm(false)}
                isLoading={isLoading}
              />
            )}
            {volunteerStatus === 'finished' && <span>✔️ הקריאה נסגרה</span>}
            {volunteerStatus === 'cant' && <span>❌ לא השתתפת בקריאה</span>}
          </>
        )}
      </div>
    </div>
  );
}
