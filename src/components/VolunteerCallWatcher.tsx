// src/components/VolunteerCallWatcher.tsx
import { getSession, isValidToken } from "../services/auth.utils";
import { useAssignedCallsWatcher } from "./useAssignedCallsWatcher";

const getRoleFromToken = (token: string): string | null => {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch {
    return null;
  }
};

const getVolunteerIdFromToken = (token: string): number | null => {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    return payload["nameid"] ? Number(payload["nameid"]) : null;
  } catch {
    return null;
  }
};

export default function VolunteerCallWatcher() {
  const token = getSession();
  const role = token && isValidToken(token) ? getRoleFromToken(token) : null;
  const volunteerId = token && isValidToken(token) ? getVolunteerIdFromToken(token) : null;

  // ✅ הקריאה ל-hook מחוץ ל-useEffect
  if (role === "Volunteer" && volunteerId) {
    useAssignedCallsWatcher(volunteerId);
  }

  return null;
}
