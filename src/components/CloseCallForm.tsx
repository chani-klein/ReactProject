import { useState } from "react";

interface CloseCallFormProps {
  onSubmit: (summary: string) => void;
  isLoading?: boolean;
}

export default function CloseCallForm({ onSubmit, isLoading = false }: CloseCallFormProps) {
  const [summary, setSummary] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim() && summary.length >= 10) {
      onSubmit(summary.trim());
      setSummary('');
      setCharCount(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setSummary(value);
      setCharCount(value.length);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>📝 דו״ח סיום קריאה</h3>
      
      <div style={{ position: 'relative' }}>
        <textarea
          value={summary}
          onChange={handleChange}
          placeholder="אנא פרט את הפעולות שבוצעו, המצב הסופי, והערות רלוונטיות נוספות..."
          required
          minLength={10}
          disabled={isLoading}
          style={{
            minHeight: '150px',
            paddingBottom: '2rem'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '1rem',
          fontSize: '0.8rem',
          color: charCount > maxChars * 0.8 ? 'var(--warning-color)' : 'var(--text-secondary)'
        }}>
          {charCount}/{maxChars}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading || summary.length < 10}
        style={{
          opacity: isLoading || summary.length < 10 ? 0.6 : 1,
          cursor: isLoading || summary.length < 10 ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? '🔄 שומר דו״ח...' : '✅ סיים קריאה'}
      </button>
      
      {summary.length > 0 && summary.length < 10 && (
        <p style={{ 
          color: 'var(--warning-color)', 
          fontSize: '0.9rem', 
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          נדרשים לפחות 10 תווים לדו״ח
        </p>
      )}
    </form>
  );
}