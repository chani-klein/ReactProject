import React, { useEffect } from "react";
import { useCallContext } from "../contexts/CallContext";
// החלפנו כאן את הפונקציה השגויה בפונקציה המתאימה
import { getnotifiedAssignedCalls } from "../services/calls.service";
import { useLocation } from "react-router-dom";

const UnifiedVolunteerCallWatcher: React.FC = () => {
  const { setPopupCall } = useCallContext();
  const location = useLocation();

  useEffect(() => {
    const allowedPaths = [
      "/volunteerPage",
      "/VolunteerListPage",
      "/volunteer/update-details",
      "/volunteer/active-calls",
      "/volunteer/history",
      "/volunteer/menu",
      "/my-calls",
    ];

    if (!allowedPaths.includes(location.pathname)) {
      console.info("Polling stopped: Current path is not allowed for polling.");
      return;
    }

    const volunteerId = localStorage.getItem("volunteerId");

    if (!volunteerId) {
      console.warn("Polling stopped: No valid volunteerId.");
      return;
    }

    console.log("🔍 Current volunteerId:", volunteerId);
    console.log("🔍 Using API: getnotifiedAssignedCalls");

    const interval = setInterval(async () => {
      try {
        const calls = await getnotifiedAssignedCalls(Number(volunteerId));
        console.log("🔍 Calls fetched:", calls);

        if (calls && calls.length > 0) {
          setPopupCall((prevPopupCall) => {
            if (prevPopupCall?.id === calls[0].id) {
              console.info("Popup already set for this call. Skipping.");
              return prevPopupCall;
            }
            console.log("📢 popupCall updated successfully with:", calls[0]);
            return calls[0];
          });
        } else {
          console.info("No new calls available. Popup will remain unchanged.");
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.info("No calls assigned to the volunteer. Continuing polling.");
        } else {
          console.error("UnifiedVolunteerCallWatcher error", error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [setPopupCall, location.pathname]);

  return null;
};

export default UnifiedVolunteerCallWatcher;
