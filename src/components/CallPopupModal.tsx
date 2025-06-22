import { useCallContext } from "../contexts/CallContext";
import { useEffect, useState } from "react";
import { updateCallStatus } from "../services/calls.service";
import AlertModal from "./AlertModal";
export default function CallPopupModal() {
  const { popupCall, setPopupCall, isLoading, setIsLoading } = useCallContext();
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (popupCall) {
      // Reverse geocoding for address
      reverseGeocode(popupCall.locationX, popupCall.locationY)
        .then(setAddress)
        .catch(() => setAddress('כתובת לא זמינה'));
    }
  }, [popupCall]);

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=he`
      );
      const data = await response.json();
      return data.display_name || 'כתובת לא זמינה';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'כתובת לא זמינה';
    }
  };

  const accept = async () => {
    if (!popupCall) return;
    setIsLoading(true);
    try {
      await updateCallStatus(popupCall.id, "בדרך");
      setPopupCall(null);
    } catch (err) {
      console.error("שגיאה באישור הקריאה:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const decline = async () => {
    if (!popupCall) return;
    setIsLoading(true);
    try {
      await updateCallStatus(popupCall.id, "לא זמין");
      setPopupCall(null);
    } catch (err) {
      console.error("שגיאה בסירוב הקריאה:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertModal
      isOpen={!!popupCall}
      call={popupCall}
      address={address}
      onAccept={accept}
      onDecline={decline}
      onClose={() => setPopupCall(null)}
    />
  );
}