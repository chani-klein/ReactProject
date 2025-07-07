import React, { useEffect } from 'react';
import { useCallContext } from '../contexts/CallContext';
import { getAssignedCalls } from '../services/calls.service';
import { useLocation } from 'react-router-dom';

const GlobalVolunteerCallWatcher: React.FC = () => {
  const { setPopupCall } = useCallContext();
  const location = useLocation();

  useEffect(() => {
    const allowedPaths = [
      '/volunteer',
      '/volunteer/VolunteerActiveCallsPage', // Updated route for active calls page
      '/volunteer/VolunteerCallHistoryPage', // Updated route for call history page
      '/volunteer/VolunteerUpdatePage', // Updated route for update page
    ];

    if (!allowedPaths.includes(location.pathname)) {
      console.info('Polling stopped: Current path is not allowed for polling.');
      return;
    }

    const volunteerId = localStorage.getItem('volunteerId');

    if (!volunteerId) {
      console.warn('Polling stopped: No valid volunteerId.');
      return;
    }

    const interval = setInterval(async () => {
      try {
        const calls = await getAssignedCalls(Number(volunteerId), 'notified');
        if (calls && calls.length > 0) {
          const notifiedCall = calls.find((call: any) => call.status === 'notified');
          if (notifiedCall) {
            setPopupCall(notifiedCall);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          // 404 is expected when no calls are assigned, suppress logging
          console.info('No calls assigned to the volunteer.');
        } else {
          console.error('GlobalVolunteerCallWatcher error', error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [setPopupCall, location.pathname]);

  return null;
};

export default GlobalVolunteerCallWatcher;
