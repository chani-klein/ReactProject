interface Props {
  call: any;
  onStatusUpdate: (id: number, status: string) => void;
}

export default function ActiveCallCard({ call, onStatusUpdate }: Props) {
  return (
    <div className="card">
      <h3>📍 מיקום: ({call.locationX}, {call.locationY})</h3>
      <p><strong>תיאור:</strong> {call.description}</p>
      <p><strong>סטטוס:</strong> {call.status}</p>
      <div className="actions">
        <button onClick={() => onStatusUpdate(call.id, "בדרך")}>🚑 יצאתי</button>
        <button onClick={() => onStatusUpdate(call.id, "דורש תגבורת")}>🆘 תגבורת</button>
        <button onClick={() => onStatusUpdate(call.id, "בטיפול")}>🔧 בטיפול</button>
        <button onClick={() => onStatusUpdate(call.id, "נסגר")}>✔ סיום</button>
      </div>
    </div>
  );
}
