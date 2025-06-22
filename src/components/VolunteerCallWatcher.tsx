import { useEffect } from "react";
import { getSession } from "../auth/auth.utils";
import { useCallContext } from "../contexts/CallContext";
import {getNearbyCalls} from "../services/volunteer.service";

export default function VolunteerCallWatcher() {
  const { setPopupCall } = useCallContext();

  useEffect(() => {
     console.log("🔁 useEffect הופעל");
  const token = getSession();
  
  console.log("טוקן שהתקבל:", token);
  if (!token) return;

  const payloadBase64 = token.split(".")[1];
  console.log("payloadBase64:", payloadBase64);
  if (!payloadBase64) return;

  const decodedPayload = atob(payloadBase64);
  console.log("decodedPayload:", decodedPayload);

  const payload = JSON.parse(decodedPayload);
  console.log("payload JSON:", payload);

  // const volunteerId = Number(payload["nameid"]);
  // console.log("volunteerId:", volunteerId);
  // if (!volunteerId) return;
const volunteerId = Number(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

  const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  // const volunteerId = Number(payload["nameid"]);
  console.log("volunteerId"); 
  console.log(volunteerId);
    
  if (role !== "Volunteer" || !volunteerId) return;

  const interval = setInterval(async () => {
    try {
      const res = await getNearbyCalls(volunteerId);
      console.log("📡 תוצאה מהשרת:", res.data);
      const call = res.data;
      if (call && call.length) setPopupCall(call[0]); // לדוגמה – הצג אחת
    } catch (err) {
      console.error("שגיאה באיתור קריאות", err);
    }
  }, 5000);

  return () => clearInterval(interval);
}, []);


  return null;
}
