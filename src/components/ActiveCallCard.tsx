import { useState } from "react";
import { Call } from "../types/call.types";


interface ActiveCallCardProps {
  call: Call;
  onStatusUpdate: (id: number, status: string) => void;
}

export default function ActiveCallCard({ call, onStatusUpdate }: ActiveCallCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'קריטי': return 'danger';
      case 'גבוה': return 'warning';
      case 'בינוני': return 'primary';
      default: return 'success';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ממתין': return 'pending';
      case 'בדרך': return 'on-way';
      case 'בטיפול': return 'in-progress';
      default: return 'pending';
    }
  };

  const navigateToLocation = async (lat: number, lon: number) => {
    setIsNavigating(true);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const wazeURL = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
      const gmapsURL = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
      
      window.open(isMobile ? wazeURL : gmapsURL, "_blank");
      
      // Small delay to show loading state
      setTimeout(() => setIsNavigating(false), 1000);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const handleStart = async () => {
    onStatusUpdate(call.id, "בדרך");
    if (call.locationX && call.locationY) {
      await navigateToLocation(call.locationX, call.locationY);
    }
  };

  return (
    <div className={`call-card status-${getStatusClass(call.status)}`}>
      <div className="call-header">
        <div className="call-info">
          <div className="call-icon">
            🚨
          </div>
          <div className="call-details">
            <h3>קריאה #{call.id}</h3>
            <p>נוצר: {new Date(call.createdAt).toLocaleString('he-IL')}</p>
          </div>
        </div>
        <div className={`call-status ${getStatusClass(call.status)}`}>
          {call.status}
        </div>
      </div>

      <div className="call-description">
        <strong>תיאור:</strong> {call.description}
      </div>

      <div className="call-location">
        📍 מיקום: ({call.locationX.toFixed(4)}, {call.locationY.toFixed(4)})
      </div>

      <div className={`call-status ${getUrgencyColor(call.urgencyLevel??0)}`}>
        🚨 דחיפות: {call.urgencyLevel}
      </div>

      <div className="actions">
        <button 
          className="btn btn-primary" 
          onClick={handleStart}
          disabled={isNavigating}
        >
          {isNavigating ? '🔄 פותח ניווט...' : '🚑 יצאתי'}
        </button>
        <button 
          className="btn btn-warning" 
          onClick={() => onStatusUpdate(call.id, "דורש תגבורת")}
        >
          🆘 תגבורת
        </button>
        <button 
          className="btn btn-success" 
          onClick={() => onStatusUpdate(call.id, "בטיפול")}
        >
          🔧 בטיפול
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => onStatusUpdate(call.id, "נסגר")}
        >
          ✔ סיום
        </button>
      </div>
    </div>
  );
}

