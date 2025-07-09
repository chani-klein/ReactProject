'use client';

import { useState, useEffect } from 'react';
import BackgroundLayout from '../../layouts/BackgroundLayout';
import { getVolunteerDetails } from '../../services/volunteer.service';
import { getVolunteerCallHistory } from '../../services/calls.service';
import type { Call } from '../../types/call.types';

export default function HistoryPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const volunteerId = await getVolunteerDetails();
        if (!volunteerId) throw new Error('מתנדב לא מזוהה');
        const res = await getVolunteerCallHistory(volunteerId);
        setCalls(res);
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
    switch (status) {
      case 'Open': return 'פתוחה';
      case 'InProgress': return 'בטיפול';
      case 'Closed': return 'הושלמה';
      default: return 'לא ידוע';
    }
  };

  return (
    <BackgroundLayout>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📖 היסטוריית קריאות</h2>

      {loading ? (
        <p>טוען נתונים...</p>
      ) : calls.length === 0 ? (
        <p>אין קריאות להצגה.</p>
      ) : (
        <div style={{ overflowX: 'auto', direction: 'rtl' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead style={{ backgroundColor: '#f0f0f0' }}>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>תיאור</th>
                <th style={thStyle}>תאריך</th>
                <th style={thStyle}>סטטוס</th>
                <th style={thStyle}>רמת דחיפות</th>
                <th style={thStyle}>מיקום (X,Y)</th>
                <th style={thStyle}>מס' מתנדבים</th>
                <th style={thStyle}>נשלח לבי"ח</th>
                <th style={thStyle}>שם בי"ח</th>
                <th style={thStyle}>סיכום</th>
                <th style={thStyle}>תמונה</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call, index) => (
                <tr key={call.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{call.description || '---'}</td>
                  <td style={tdStyle}>
                    {call.date ? new Date(call.date).toLocaleString('he-IL') : '---'}
                  </td>
                  <td style={tdStyle}>{formatStatus(call.status)}</td>
                  <td style={tdStyle}>{call.urgencyLevel ?? '---'}</td>
                  <td style={tdStyle}>
                    ({call.locationY}, {call.locationX})
                  </td>
                  <td style={tdStyle}>{call.numVolanteer}</td>
                  <td style={tdStyle}>{call.sentToHospital ? '✔️' : '❌'}</td>
                  <td style={tdStyle}>{call.hospitalName || '---'}</td>
                  <td style={{ ...tdStyle, maxWidth: '200px', whiteSpace: 'pre-wrap' }}>
                    {call.summary || '---'}
                  </td>
                  <td style={tdStyle}>
                    {call.imageUrl ? (
                      <a href={call.imageUrl} target="_blank" rel="noopener noreferrer">
                        📷 צפייה
                      </a>
                    ) : (
                      '---'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
