'use client';
import { useState, useEffect } from 'react';
import { useCallContext } from '../contexts/CallContext';
import { respondToCall, getVolunteerDetails } from '../services/volunteer.service';
import type { Call } from '../types/call.types';

export default function CallPopupModal() {
  const { popupCall, setPopupCall, isLoading, setIsLoading } = useCallContext();
  const [address, setAddress] = useState<string>('');
  const [volunteerId, setVolunteerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchVolunteerId = async () => {
      const id = await getVolunteerDetails();
      setVolunteerId(id);
    };
    fetchVolunteerId();
  }, []);

  useEffect(() => {
    if (popupCall) {
      reverseGeocode(popupCall.locationX, popupCall.locationY)
        .then(setAddress)
        .catch(() => setAddress('כתובת לא זמינה'));
    }
  }, [popupCall]);

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=he`
      );
      const data = await response.json();
      return data.display_name || 'כתובת לא זמינה';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'כתובת לא זמינה';
    }
  };

  const accept = async () => {
    if (!popupCall || !volunteerId) return;

    setIsLoading(true);
    try {
      // שליחת תגובה לשרת
      await respondToCall(popupCall.id, 'going');

      // פתיחת ניווט בגוגל מפות
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${popupCall.locationX},${popupCall.locationY}`,
        '_blank'
      );

      // סגירת הפופאפ
      setPopupCall(null);

      // מעבר לדף הקריאות הפעילות
      window.location.href = '/volunteer/active-calls';
    } catch (err) {
      console.error('שגיאה באישור הקריאה:', err);
      alert('שגיאה באישור הקריאה, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const decline = async () => {
    if (!popupCall || !volunteerId) return;

    setIsLoading(true);
    try {
      await respondToCall(popupCall.id, 'cant');
      setPopupCall(null);
    } catch (err) {
      console.error('שגיאה בסירוב הקריאה:', err);
      alert('שגיאה בסירוב הקריאה, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  if (!popupCall) return null;

  return (
    <div className="modal-overlay" onClick={() => setPopupCall(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">🚨</div>
          <h2 className="modal-title">קריאה חדשה באזור שלך!</h2>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <p><strong>📝 תיאור:</strong> {popupCall.description}</p>
            <p><strong>🚨 דחיפות:</strong> {popupCall.urgencyLevel}</p>
            <p><strong>📍 כתובת:</strong> {address || `${popupCall.locationX}, ${popupCall.locationY}`}</p>
            <p><strong>⏰ זמן:</strong> {new Date(popupCall.createdAt).toLocaleString('he-IL')}</p>
            <p><strong>🚗 מתנדבים בדרך:</strong> {popupCall.goingVolunteersCount || 0}</p>
          </div>

          <div className="modal-warning" style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            padding: '0.75rem',
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            ⚠️ לחיצה על "אני יוצא" תפתח ניווט ותעביר אותך לדף הקריאות הפעילות
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-success"
            onClick={accept}
            disabled={isLoading}
            style={{ marginLeft: '0.5rem' }}
          >
            {isLoading ? '🔄 מעבד...' : '🚑 אני יוצא'}
          </button>

          <button
            className="btn btn-danger"
            onClick={decline}
            disabled={isLoading}
          >
            {isLoading ? '🔄 מעבד...' : '❌ לא יכול'}
          </button>
        </div>
      </div>
    </div>
  );
}
