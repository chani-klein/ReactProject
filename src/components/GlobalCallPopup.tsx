// src/components/GlobalCallPopup.tsx
import Modal from "react-modal";
import { useCallContext } from "../contexts/CallContext";
import axios from "../services/axios";

export default function GlobalCallPopup() {
  const { activeCall, clearCallPopup } = useCallContext();

  const handleAccept = async () => {
    try {
      await axios.put(`/api/Calls/${activeCall.id}/status`, {
        status: "בדרך",
      });
      clearCallPopup();
    } catch (err) {
      console.error("שגיאה בשליחת 'אני בדרך'", err);
    }
  };

  const handleDecline = async () => {
    try {
      await axios.put(`/api/Calls/${activeCall.id}/status`, {
        status: "לא זמין",
      });
      clearCallPopup();
    } catch (err) {
      console.error("שגיאה בשליחת 'לא זמין'", err);
    }
  };

  return (
    <Modal
      isOpen={!!activeCall}
      onRequestClose={clearCallPopup}
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
      {activeCall && (
        <>
          <h2>📢 קריאה חדשה עבורך!</h2>
          <p><strong>תיאור:</strong> {activeCall.description}</p>
          <p><strong>דחיפות:</strong> {activeCall.urgencyLevel}</p>
          <p><strong>כתובת:</strong> {activeCall.locationDescription || `${activeCall.locationX}, ${activeCall.locationY}`}</p>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button onClick={handleAccept} className="btn-confirm">אני בדרך</button>
            <button onClick={handleDecline} className="btn-cancel">לא זמין</button>
          </div>
        </>
      )}
    </Modal>
  );
}
