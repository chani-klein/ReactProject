import Modal from "react-modal";
import { useCallContext } from "../contexts/CallContext";
import axios from "../services/axios";
import {updateCallStatus} from "../services/calls.service";
export default function CallPopupModal() {
  const { popupCall, setPopupCall } = useCallContext();

  if (!popupCall) return null;

const accept = async () => {
  try {
    await updateCallStatus(popupCall.id, "בדרך");
    setPopupCall(null);
  } catch (err) {
    console.error("שגיאה באישור הקריאה:", err);
  }
};

const decline = async () => {
  try {
    await updateCallStatus(popupCall.id, "לא זמין");
    setPopupCall(null);
  } catch (err) {
    console.error("שגיאה בסירוב הקריאה:", err);
  }
};


  return (
    <Modal
      isOpen={!!popupCall}
      ariaHideApp={false}
      style={{
        content: {
          direction: "rtl",
          maxWidth: "500px",
          margin: "auto",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#fff",
          zIndex: 9999,
        },
      }}
    >
      <h2>📣 קריאה חדשה</h2>
      <p>📝 תיאור: {popupCall.description}</p>
      <p>🚨 דחיפות: {popupCall.urgencyLevel}</p>
      <p>📍 מיקום: {popupCall.locationX}, {popupCall.locationY}</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <button onClick={accept}>🚑 אני בדרך</button>
        <button onClick={decline}>❌ לא זמין</button>
      </div>
    </Modal>
  );
}
