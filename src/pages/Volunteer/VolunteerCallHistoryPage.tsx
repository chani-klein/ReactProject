'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import { getVolunteerDetails } from '../../services/volunteer.service';
import { getVolunteerCallHistory } from '../../services/calls.service';
import type { Call } from '../../types/call.types';
import '../../style/VolunteerHistoryPage.css';
import '../../style/emergency-styles.css';

export default function HistoryPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // חזור לדף הקודם
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const volunteerId = await getVolunteerDetails();
        console.log('📋 Volunteer ID:', volunteerId);
        
        if (!volunteerId) throw new Error('מתנדב לא מזוהה');
        
        const res = await getVolunteerCallHistory(volunteerId);
        console.log('📋 Raw history data:', res);
        
        // בדיקה אם זה array או object
        const callsData = Array.isArray(res) ? res : res.data || res.calls || [];
        console.log('📋 Processed calls data:', callsData);
        
        setCalls(callsData);
      } catch (error) {
        console.error('❌ שגיאה בטעינת היסטוריית הקריאות:', error);
        alert('שגיאה בטעינת היסטוריית קריאות');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatStatus = (status: string | null | undefined) => {
    console.log('🔍 Formatting status:', status);
    switch (status?.toLowerCase()) {
      case 'open': 
      case 'פתוח':
        return 'פתוחה';
      case 'inprogress':
      case 'in_progress': 
      case 'בטיפול':
        return 'בטיפול';
      case 'closed':
      case 'נסגר':
      case 'הושלם':
        return 'הושלמה';
      default: 
        console.log('🔍 Unknown status:', status);
        return status || 'לא ידוע';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '---';
      return date.toLocaleString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '---';
    }
  };

  const formatUrgencyLevel = (level: number | string | null | undefined) => {
    if (!level) return '---';
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    switch (numLevel) {
      case 1: return 'נמוכה';
      case 2: return 'בינונית';
      case 3: return 'גבוהה';
      case 4: return 'קריטית';
      default: return level?.toString() || '---';
    }
  };

  return (
    <BackgroundLayout>
      <div className="history-wrapper">
        <div className="history-container">
          <div className="history-header">
            <button 
              onClick={handleGoBack}
              className="back-button"
            >
              <ArrowRight className="back-icon" />
              חזור
            </button>
            <h2>📖 היסטוריית קריאות</h2>
          </div>

          {loading ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>טוען נתונים...</p>
            </div>
          ) : calls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>אין קריאות להצגה</h3>
              <p>עדיין לא השתתפת בקריאות חירום</p>
            </div>
          ) : (
            <div className="calls-grid">
              {calls.map((call, index) => {
                console.log('🔍 Rendering call:', call);
                return (
                  <div key={call.id || index} className="call-card">
                    <div className="call-header">
                      <span className="call-number">#{call.id || index + 1}</span>
                      <span className={`status-badge status-${call.status?.toLowerCase() || 'unknown'}`}>
                        {formatStatus(call.status)}
                      </span>
                    </div>
                    
                    <div className="call-content">
                      <div className="call-section">
                        <h4>תיאור הקריאה</h4>
                        <p>{call.description || call.Description || 'אין תיאור זמין'}</p>
                      </div>
                      
                      <div className="call-details">
                        <div className="detail-item">
                          <strong>תאריך:</strong>
                          <span>{formatDate(call.date || call.createdAt || call.timestamp)}</span>
                        </div>
                        <div className="detail-item">
                          <strong>רמת דחיפות:</strong>
                          <span className={`urgency-level urgency-${call.urgencyLevel || call.UrgencyLevel}`}>
                            {formatUrgencyLevel(call.urgencyLevel || call.UrgencyLevel)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>מיקום:</strong>
                          <span>
                            {(call.locationX || call.LocationX) && (call.locationY || call.LocationY) 
                              ? `(${call.locationY || call.LocationY}, ${call.locationX || call.LocationX})`
                              : 'מיקום לא זמין'
                            }
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>מס' מתנדבים:</strong>
                          <span>{call.numVolanteer || call.NumVolunteer || '---'}</span>
                        </div>
                        <div className="detail-item">
                          <strong>נשלח לבי"ח:</strong>
                          <span className={(call.sentToHospital || call.SentToHospital) ? 'sent-yes' : 'sent-no'}>
                            {(call.sentToHospital || call.SentToHospital) ? '✔️ כן' : '❌ לא'}
                          </span>
                        </div>
                        {(call.hospitalName || call.HospitalName) && (
                          <div className="detail-item">
                            <strong>שם בי"ח:</strong>
                            <span>{call.hospitalName || call.HospitalName}</span>
                          </div>
                        )}
                      </div>
                      
                      {(call.summary || call.Summary) && (
                        <div className="call-section">
                          <h4>סיכום</h4>
                          <p className="summary-text">{call.summary || call.Summary}</p>
                        </div>
                      )}
                      
                      {(call.imageUrl || call.ImageUrl || call.fileImage || call.FileImage) && (
                        <div className="call-section">
                          <h4>תמונה</h4>
                          <a 
                            href={call.imageUrl || call.ImageUrl || call.fileImage || call.FileImage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="image-link"
                          >
                            📷 צפייה בתמונה
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BackgroundLayout>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'right',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  borderBottom: '2px solid #ccc',
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'right',
  fontSize: '0.9rem',
};
