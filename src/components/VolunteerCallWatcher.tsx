
import { useEffect, useRef } from "react";
import { getSession } from "../auth/auth.utils";
import { useCallContext } from "../contexts/CallContext";
import { getNearbyCalls } from "../services/volunteer.service";
import type { Call } from "../types/call.types";

export default function VolunteerCallWatcher() {
  const { setPopupCall, popupCall } = useCallContext();
  const ignoredCallIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const token = getSession();
    if (!token) return;

    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return;

    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    const volunteerId = Number(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role !== "Volunteer" || !volunteerId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getNearbyCalls(volunteerId);
        const calls: Call[] = res.data;

        const newCall = calls.find(call => {
          const alreadyIgnored = ignoredCallIds.current.has(call.id);
          const alreadyShown = popupCall?.id === call.id;
          return !alreadyIgnored && !alreadyShown;
        });

        if (newCall) {
          setPopupCall(newCall);
        }
      } catch (err) {
        console.error("שגיאה באיתור קריאות", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [setPopupCall, popupCall]);
   return null;
}
