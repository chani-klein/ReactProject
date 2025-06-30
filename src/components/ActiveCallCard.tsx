'use client';
import { useState, useEffect } from 'react';
import CloseCallForm from './CloseCallForm';
import { updateVolunteerStatus, completeCall, getCallVolunteersInfo } from '../services/volunteer.service';
import { getVolunteerDetails } from '../services/volunteer.service';
import type { Call, VolunteerStatus } from '../types/call.types';

interface ActiveCallCardProps {
  call: Call;
  onStatusUpdate: (callId: number, newStatus: 'going' | 'arrived' | 'finished', summary?: string) => void;
}

export default function ActiveCallCard({ call, onStatusUpdate }: ActiveCallCardProps) {
  const [address, setAddress] = useState<string>('');
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<string>('going');
  const [goingVolunteersCount, setGoingVolunteersCount] = useState<number>(call.goingVolunteersCount || 0);

  useEffect(() => {
    if (call.locationX && call.locationY) {
      reverseGeocode(call.locationX, call.locationY)
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
        console.error('שגיאה בשליפת מידע קריאה:', err);
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

  const handleStatusUpdate = async (newStatus: 'going' | 'arrived' | 'finished') => {
    setIsLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      await onStatusUpdate(call.id, newStatus);
      setVolunteerStatus(newStatus);
    } catch (error) {
      console.error('שגיאה בעדכון סטטוס:', error);
      alert('שגיאה בעדכון הסטטוס, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteCall = async (summary: string) => {
    setIsLoading(true);
    try {
      const volunteerId = await getVolunteerDetails();
      if (!volunteerId) throw new Error('מתנדב לא מזוהה');
      await completeCall(call.id, summary);
      await onStatusUpdate(call.id, 'finished', summary);
      setShowCloseForm(false);
    } catch (error) {
      console.error('שגיאה בסיום קריאה:', error);
      alert('שגיאה בסיום הקריאה, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (volunteerStatus) {
      case 'going':
        return { text: '🚗 בדרך', color: '#ff9800' };
      case 'arrived':
        return { text: '🎯 הגעתי', color: '#4caf50' };
      case 'finished':
        return { text: '✅ הושלם', color: '#8bc34a' };
      default:
        return { text: '🚗 בדרך', color: '#ff9800' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="card-header">
        <h3 style={{ margin: 0 }}>{call.description}</h3>
        <span
          style={{
            backgroundColor: statusDisplay.color,
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
          }}
        >
          {statusDisplay.text}
        </span>
      </div>

      <div className="card-body">
        <p><strong>🚨 דחיפות:</strong> {call.urgencyLevel}</p>
        <p><strong>📍 כתובת:</strong> {address}</p>
        <p><strong>⏰ זמן:</strong> {new Date(call.createdAt).toLocaleString('he-IL')}</p>
        <p><strong>🚗 מתנדבים בדרך:</strong> {goingVolunteersCount}</p>
        {call.imageUrl && (
          <div style={{ margin: '1rem 0' }}>
            <img src={call.imageUrl} alt="תמונת הקריאה" style={{ maxWidth: '200px', borderRadius: '4px' }} />
          </div>
        )}
      </div>

      <div className="card-actions">
        {volunteerStatus === 'going' && (
          <button
            className="btn btn-success"
            onClick={() => handleStatusUpdate('arrived')}
            disabled={isLoading}
          >
            {isLoading ? '🔄 מעדכן...' : '🎯 הגעתי'}
          </button>
        )}

        {volunteerStatus === 'arrived' && (
          <button
            className="btn btn-warning"
            onClick={() => setShowCloseForm(true)}
            disabled={isLoading}
          >
            {isLoading ? '🔄 מעדכן...' : '✅ סיום קריאה'}
          </button>
        )}

        {showCloseForm && (
          <div style={{ marginTop: '1rem' }}>
            <CloseCallForm onSubmit={handleCompleteCall} isLoading={isLoading} />
            <button
              className="btn btn-secondary"
              onClick={() => setShowCloseForm(false)}
              style={{ marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              ❌ ביטול
            </button>
          </div>
        )}
      </div>
    </div>
  );
}