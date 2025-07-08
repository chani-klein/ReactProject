import { useState, useEffect } from 'react';
import CloseCallForm from './CloseCallForm';
import { updateVolunteerStatus, getCallVolunteersInfo, getVolunteerDetails } from '../services/volunteer.service';
import { finishVolunteerCall } from '../services/calls.service';
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
  const [volunteerStatus, setVolunteerStatus] = useState<string>('going');
  const [goingVolunteersCount, setGoingVolunteersCount] = useState<number>(call.goingVolunteersCount || 0);
  const [showMap, setShowMap] = useState(true);

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

  useEffect(() => {
    if (volunteerStatus === 'arrived') {
        console.log('🔄 Volunteer status updated to arrived. Updating UI...');
        // ניתן להוסיף לוגיקה נוספת אם נדרש
    }
  }, [volunteerStatus]);

  const handleArrivedUpdate = async () => {
    if (!volunteerStatus || volunteerStatus !== 'going') {
      alert('לא ניתן לעדכן ל-"הגעתי" לפני שהסטטוס הוא "בדרך".');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Attempting to update status to arrived for call:', call.id);
      await updateVolunteerStatus(call.id, 'arrived');
      console.log('✅ Status updated to arrived successfully');
      setVolunteerStatus('arrived');
      onStatusUpdate();
    } catch (error) {
      console.error('❌ Error updating status to arrived:', error);
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

      await finishVolunteerCall(call.id, volunteerId, summary);

      setShowCloseForm(false);
      setVolunteerStatus('finished');
      onStatusUpdate();
    } catch (error) {
      console.error('שגיאה בסיום הקריאה:', error);
      alert('שגיאה בסיום הקריאה, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (volunteerStatus) {
      case 'going':
        return { text: 'בדרך', color: '#2196F3' };
      case 'arrived':
        return { text: 'הגעתי', color: '#FF9800' };
      case 'finished':
        return { text: 'הושלם', color: '#4CAF50' };
      default:
        return { text: 'בדרך', color: '#2196F3' };
    }
  };

  const badge = getStatusBadge();

  return (
    <div style={{ display: 'flex', height: '100vh', direction: 'rtl' }}>
      {/* פאנל פרטי הקריאה */}
      <div style={{ 
        width: showMap ? '40%' : '100%', 
        padding: '1rem', 
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
        borderLeft: showMap ? '2px solid #ddd' : 'none'
      }}>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>{call.description}</h3>
            <span
              style={{
                backgroundColor: badge.color,
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}
            >
              {badge.text}
            </span>
          </div>
          
          <div className="card-body">
            <p><strong>🚨 דחיפות:</strong> {call.urgencyLevel ?? "לא זמין"}</p>
            <p><strong>📍 כתובת:</strong> {address || "לא זמין"}</p>
            <p><strong>⏰ זמן:</strong> {call.createdAt ? new Date(call.createdAt).toLocaleString('he-IL') : "לא זמין"}</p>
            <p><strong>🚗 מתנדבים בדרך:</strong> {goingVolunteersCount ?? 0}</p>
            
            {call.imageUrl && (
              <div style={{ margin: '1rem 0' }}>
                <img src={call.imageUrl} alt="תמונת הקריאה" style={{ maxWidth: '100%', borderRadius: '4px' }} />
              </div>
            )}
          </div>

          {/* כפתורי פעולה דינאמיים */}
          <div className="card-actions">
            {volunteerStatus === 'going' && (
              <button 
                className="btn btn-warning" 
                onClick={handleArrivedUpdate} 
                disabled={isLoading}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                {isLoading ? 'מעדכן...' : '🏃‍♂️ הגעתי לזירה'}
              </button>
            )}
            
            {volunteerStatus === 'arrived' && !showCloseForm && (
              <button 
                className="btn btn-info" 
                onClick={() => setShowCloseForm(true)} 
                disabled={isLoading}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                📝 סגור פניה
              </button>
            )}
            
            {volunteerStatus === 'finished' && (
              <div style={{ textAlign: 'center', color: '#4CAF50', fontWeight: 'bold' }}>
                ✔️ הקריאה נסגרה בהצלחה
              </div>
            )}
          </div>
        </div>

        {/* טופס סגירת קריאה */}
        {showCloseForm && (
          <CloseCallForm
            onSubmit={handleCompleteCall}
            onCancel={() => setShowCloseForm(false)}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* מפה */}
      {showMap && (
        <div style={{ width: '60%', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => setShowMap(false)}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '8px 12px',
                color: '#666'
              }}
              title="סגור מפה"
            >
              ✕
            </button>
          </div>
          
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${call.locationX},${call.locationY}&zoom=15`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}

      {/* כפתור פתיחת מפה כשהיא סגורה */}
      {!showMap && (
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px',
          zIndex: 1000 
        }}>
          <button 
            onClick={() => setShowMap(true)}
            className="btn btn-primary"
            style={{
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            title="פתח מפה"
          >
            🗺️
          </button>
        </div>
      )}
    </div>
  );
}