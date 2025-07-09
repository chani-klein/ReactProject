'use client';
import type React from 'react';
import { useState } from 'react';
import type { CompleteCallDto } from '../types/call.types';

interface CloseCallFormProps {
  onSubmit: (summary: CompleteCallDto) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function CloseCallForm({ onSubmit, isLoading = false, onCancel }: CloseCallFormProps) {
  const [summary, setSummary] = useState('');
  const [sentToHospital, setSentToHospital] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim() && summary.length >= 8) {
      onSubmit({ 
        summary: summary.trim(), 
        sentToHospital, 
        hospitalName: sentToHospital ? hospitalName : undefined 
      });
      // איפוס הטופס
      setSummary('');
      setCharCount(0);
      setHospitalName('');
      setSentToHospital(false);
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

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-header">
        <h3 style={{ margin: 0 }}>📝 דוח סיום קריאה</h3>
      </div>
      
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading || !isValid}
            style={{
              opacity: isLoading || !isValid ? 0.6 : 1,
              cursor: isLoading || !isValid ? 'not-allowed' : 'pointer',
              marginLeft: '0.5rem'
            }}
          >
            {isLoading ? '🔄 שולח...' : '📤 שלח דוח'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              ❌ ביטול
            </button>
          )}
        </div>
      </form>
    </div>
  );
}