import { useEffect, useRef } from "react";
import axios from "../services/axios";
import { useCallContext } from "../contexts/CallContext";

export const useAssignedCallsWatcher = (volunteerId: number) => {
  const seenCallsRef = useRef<Set<number>>(new Set());
  const { showCallPopup } = useCallContext();

  useEffect(() => {
    if (!volunteerId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/VolunteersCalls/assigned/${volunteerId}`);
        const assignedCalls = res.data;

        for (const call of assignedCalls) {
          if (!seenCallsRef.current.has(call.id)) {
            seenCallsRef.current.add(call.id);
            showCallPopup(call);
          }
        }
      } catch (err) {
        console.error("\u274C שגיאה בקבלת קריאות מוקצות:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [volunteerId]);
};
