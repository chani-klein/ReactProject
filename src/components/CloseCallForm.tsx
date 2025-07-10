'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import type { CompleteCallDto } from '../types/call.types';
import { useNavigate } from 'react-router-dom';
import { finishVolunteerCall } from '../services/calls.service';
import { getVolunteerCallHistory } from '../services/calls.service'; // תיקון הייבוא  

interface CloseCallFormProps {
  onSubmit?: (summary: CompleteCallDto) => void; // עכשיו אופציונלי
  isLoading?: boolean;
  onCancel?: () => void;
  volunteerId: number;
  callId: number; // הוספת callId
  onClose: () => void;
}

export default function CloseCallForm({ 
  onSubmit, 
  isLoading: externalLoading = false, 
  onCancel, 
  volunteerId, 
  callId, 
  onClose 
}: CloseCallFormProps) {
  const [summary, setSummary] = useState('');
  const [sentToHospital, setSentToHospital] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const maxChars = 500;
  const navigate = useNavigate();

  // שליפת היסטוריית הקריאות כדי למצוא את הקריאה הנוכחית
  useEffect(() => {
    const fetchCallHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await getVolunteerCallHistory(volunteerId).then();
        const history = response.data;
        setCallHistory(history);
        
        // מחפש את הקריאה הנוכחית
        const current = history.find((call: any) => call.callsId === callId || call.id === callId);
        if (current) {
          setCurrentCall(current);
          console.log('📋 פרטי הקריאה הנוכחית:', current);
        } else {
          console.warn('⚠️ לא נמצאה קריאה עם ID:', callId);
        }
      } catch (error) {
        console.error('❌ שגיאה בשליפת היסטוריית הקריאות:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (callId && volunteerId) {
      fetchCallHistory();
    }
  }, [callId, volunteerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim() && summary.length >= 10) {
      const callData: CompleteCallDto = { 
        summary: summary.trim(), 
        sentToHospital, 
        hospitalName: sentToHospital ? hospitalName : undefined 
      };

      try {
        setIsLoading(true);
        
        // קריאה לשירות
        await finishVolunteerCall(callId, volunteerId, callData);
        
        // אם יש callback חיצוני - קוראים לו
        if (onSubmit) {
          onSubmit(callData);
        }
        
        // איפוס הטופס
        setSummary('');
        setCharCount(0);
        setHospitalName('');
        setSentToHospital(false);

        // סגירת המודל
        onClose();
        
        // מעבר לדף היסטוריית הקריאות
        navigate('/volunteer/history');
        
      } catch (error: any) {
        console.error('❌ שגיאה בסיום הקריאה:', error);
        alert('שגיאה בשליחת הדוח. אנא נסה שוב.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setSummary(value);
      setCharCount(value.length);
    }
  };

  const isValid = summary.trim().length >= 10 && (!sentToHospital || hospitalName.trim().length > 0);
  const finalIsLoading = isLoading || externalLoading || loadingHistory;

  // אם עדיין טוען היסטוריה
  if (loadingHistory) {
    return (
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
          <div>🔄 טוען פרטי קריאה...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-header">
        <h3 style={{ margin: 0 }}>📝 דוח סיום קריאה</h3>
      </div>
      
      {/* הצגת פרטי הקריאה */}
      {currentCall && (
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>📋 פרטי הקריאה</h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div><strong>תיאור:</strong> {currentCall.call?.description || currentCall.description || 'לא זמין'}</div>
            <div><strong>כתובת:</strong> {currentCall.call?.address || currentCall.address || 'לא צוין'}</div>
            <div><strong>סטטוס:</strong> {currentCall.volunteerStatus || currentCall.status || 'לא זמין'}</div>
            <div><strong>זמן יצירה:</strong> {
              currentCall.call?.createdAt ? new Date(currentCall.call.createdAt).toLocaleString('he-IL') :
              currentCall.createdAt ? new Date(currentCall.createdAt).toLocaleString('he-IL') : 'לא זמין'
            }</div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card-body">
        {/* שדה סיכום */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            סיכום הטיפול:
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              value={summary}
              onChange={handleSummaryChange}
              placeholder="אנא פרט את הפעולות שבוצעו, המצב הסופי, והערות רלוונטיות נוספות..."
              required
              minLength={10}
              disabled={finalIsLoading}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                paddingBottom: '2rem'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0.5rem',
                left: '1rem',
                fontSize: '0.8rem',
                color: charCount > maxChars * 0.8 ? '#ff6b6b' : '#666',
              }}
            >
              {charCount}/{maxChars}
            </div>
          </div>
          {summary.length > 0 && summary.length < 10 && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              נדרשים לפחות 10 תווים לדוח
            </p>
          )}
        </div>

        {/* שדה שליחה לבית חולים */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sentToHospital}
              onChange={(e) => setSentToHospital(e.target.checked)}
              disabled={finalIsLoading}
              style={{ marginLeft: '0.5rem' }}
            />
            <span style={{ fontWeight: 'bold' }}>🏥 נשלח לבית חולים</span>
          </label>
        </div>

        {/* שדה שם בית חולים */}
        {sentToHospital && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              שם בית החולים:
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="הזן שם בית החולים"
              required={sentToHospital}
              disabled={finalIsLoading}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
        )}

        {/* כפתורי פעולה */}
        <div className="card-actions" style={{ marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="btn btn-success"
            disabled={finalIsLoading || !isValid}
            style={{
              opacity: finalIsLoading || !isValid ? 0.6 : 1,
              cursor: finalIsLoading || !isValid ? 'not-allowed' : 'pointer',
              marginLeft: '0.5rem'
            }}
          >
            {finalIsLoading ? '🔄 שולח...' : '📤 שלח דוח'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={finalIsLoading}
            >
              ❌ ביטול
            </button>
          )}
        </div>
      </form>
    </div>
  );
}