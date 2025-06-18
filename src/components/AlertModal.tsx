import Modal from "react-modal";

interface AlertModalProps {
  isOpen: boolean;
  call: any;
  address: string | null;
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
      onRequestClose={onClose}
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
          <p><strong>דחיפות:</strong> {call.urgencyLevel}</p>
          <p><strong>כתובת:</strong> {address || `${call.locationX}, ${call.locationY}`}</p>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button onClick={onAccept} className="btn-confirm">אני בדרך</button>
            <button onClick={onDecline} className="btn-cancel">לא זמין</button>
          </div>
        </>
      )}
    </Modal>
  );
}
