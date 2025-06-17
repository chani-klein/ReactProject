// src/components/AlertModal.tsx
import Modal from "react-modal";

interface AlertModalProps {
  isOpen: boolean;
  call: {
    id: number;
    description: string;
    urgencyLevel: string;
    locationDescription: string;
    locationX: number;
    locationY: number;
  } | null;
  address?: string | null; // ✅ כתובת אנושית שתעבור מההורה
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export default function AlertModal({
  isOpen,
  call,
  address,
  onAccept,
  onDecline,
  onClose,
}: AlertModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="קריאה חדשה"
      ariaHideApp={false}
      style={{
        content: {
          direction: "rtl",
          maxWidth: "500px",
          margin: "auto",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#fff",
        },
      }}
    >
      {call && (
        <>
          <h2>📢 קריאה חדשה באזור שלך!</h2>
          <p><strong>תיאור:</strong> {call.description}</p>
          <p><strong>רמת דחיפות:</strong> {call.urgencyLevel}</p>
          <p><strong>מיקום:</strong> {call.locationDescription || `${call.locationX}, ${call.locationY}`}</p>

          {/* ✅ הצגת כתובת אנושית אם קיימת */}
          {address && (
          
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#333" }}>
              🏠 <strong>כתובת:</strong> {address}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button onClick={onAccept} className="btn-confirm">אני בדרך</button>
            <button onClick={onDecline} className="btn-cancel">לא זמין</button>
          </div>
        </>
      )}
    </Modal>
  );
}
