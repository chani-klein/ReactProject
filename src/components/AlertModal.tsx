import Modal from "react-modal";
import { useEffect, useState } from "react";
import { Call } from "../types/call.types";
interface AlertModalProps {
  isOpen: boolean;
  call: Call | null;
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await onDecline();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !call) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">
            🚨
          </div>
          <h2 className="modal-title">קריאה חדשה באזור שלך!</h2>
        </div>
        
        <div className="modal-body">
          <div className="modal-info">
            <p><strong>📝 תיאור:</strong> {call.description}</p>
            <p><strong>🚨 דחיפות:</strong> {call.urgencyLevel}</p>
            <p><strong>📍 כתובת:</strong> {address || `${call.locationX}, ${call.locationY}`}</p>
            <p><strong>⏰ זמן:</strong> {new Date(call.createdAt).toLocaleString('he-IL')}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-success" 
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing ? '🔄 מעבד...' : '🚑 אני בדרך'}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDecline}
            disabled={isProcessing}
          >
            {isProcessing ? '🔄 מעבד...' : '❌ לא זמין'}
          </button>
        </div>
      </div>
    </div>
  );
}