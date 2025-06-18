interface Props {
  call: any;
  onStatusUpdate: (id: number, status: string) => void;
}

export default function ActiveCallCard({ call, onStatusUpdate }: Props) {
  const navigateToLocation = (lat: number, lon: number) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const wazeURL = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
    const gmapsURL = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(isMobile ? wazeURL : gmapsURL, "_blank");
  };

  const handleStart = () => {
    onStatusUpdate(call.id, "בדרך");
    if (call.locationX && call.locationY) {
      navigateToLocation(call.locationX, call.locationY);
    }
  };

  return (
    <div className="card">
      <h3>📍 מיקום: ({call.locationX}, {call.locationY})</h3>
      <p><strong>תיאור:</strong> {call.description}</p>
      <p><strong>סטטוס:</strong> {call.status}</p>
      <div className="actions">
        <button onClick={handleStart}>🚑 יצאתי</button>
        <button onClick={() => onStatusUpdate(call.id, "דורש תגבורת")}>🆘 תגבורת</button>
        <button onClick={() => onStatusUpdate(call.id, "בטיפול")}>🔧 בטיפול</button>
        <button onClick={() => onStatusUpdate(call.id, "נסגר")}>✔ סיום</button>
      </div>
    </div>
  );
}
