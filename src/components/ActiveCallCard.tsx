import React, { useState } from 'react';
import { Phone, MapPin, Clock, Users, AlertCircle, CheckCircle, User } from 'lucide-react';

// Types
interface Call {
  id: number;
  address: string;
  description: string;
  priority: string;
  timestamp: string;
  status: string;
  type: string;
}

interface VolunteerCall {
  callsId: number;
  volunteerId: number;
  volunteerStatus?: string;
  responseTime?: string;
  call: Call;
  goingVolunteersCount: number;
}

// Mock service function
const updateVolunteerStatus = async (callId: number, volunteerId: number, status: string) => {
  console.log(`Updating volunteer status: callId=${callId}, volunteerId=${volunteerId}, status=${status}`);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
};

// Background Layout Component
const BackgroundLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};

// Close Call Page Component (mock)
const CloseCallPage: React.FC<{ callId: number; volunteerId: number; onClose: () => void }> = ({ 
  callId, 
  volunteerId, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">סגירת קריאה</h2>
        <p className="text-gray-600 mb-6">
          האם אתה בטוח שברצונך לסגור את הקריאה מספר {callId}?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={() => {
              console.log(`Closing call ${callId} by volunteer ${volunteerId}`);
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            סגור קריאה
          </button>
        </div>
      </div>
    </div>
  );
};

// Active Call Card Component
export interface ActiveCallCardProps {
  volunteerCall: VolunteerCall;
  onStatusUpdate: () => void;
  showArrivedOnly?: boolean;
}

const ActiveCallCard: React.FC<ActiveCallCardProps> = ({ volunteerCall, onStatusUpdate, showArrivedOnly }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseCallPage, setShowCloseCallPage] = useState(false);
  const [currentVolunteerStatus, setCurrentVolunteerStatus] = useState(volunteerCall.volunteerStatus);

  const { call, callsId, volunteerId, responseTime, goingVolunteersCount } = volunteerCall;

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'גבוה':
        return 'bg-red-500';
      case 'medium':
      case 'בינוני':
        return 'bg-yellow-500';
      case 'low':
      case 'נמוך':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'going':
      case 'בדרך':
        return 'text-blue-600 bg-blue-100';
      case 'arrived':
      case 'הגיע':
        return 'text-green-600 bg-green-100';
      case 'completed':
      case 'הושלם':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Handle arrived button click
  const handleArrivedClick = async () => {
    setIsLoading(true);
    try {
      await updateVolunteerStatus(callsId, volunteerId, 'arrived');
      setCurrentVolunteerStatus('arrived');
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close call page
  const handleCloseCallPage = () => {
    setShowCloseCallPage(false);
  };

  // Show close call page if status is arrived
  if (currentVolunteerStatus === 'arrived') {
    return (
      <>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">הגעת לזירה</h3>
            <p className="text-gray-600 mb-4">כעת תוכל לסגור את הקריאה</p>
            <button
              onClick={() => setShowCloseCallPage(true)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              סגור קריאה
            </button>
          </div>
        </div>
        
        {showCloseCallPage && (
          <CloseCallPage 
            callId={callsId} 
            volunteerId={volunteerId} 
            onClose={handleCloseCallPage} 
          />
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">קריאה #{call.id}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(call.priority)}`}>
            {call.priority}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
          {call.status}
        </div>
      </div>

      {/* Call Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-gray-700">כתובת:</span>
            <p className="text-gray-600">{call.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-gray-700">תיאור:</span>
            <p className="text-gray-600">{call.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-gray-700">זמן קריאה:</span>
          <span className="text-gray-600">{new Date(call.timestamp).toLocaleString('he-IL')}</span>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-gray-700">מתנדבים בדרך:</span>
          <span className="text-gray-600">{goingVolunteersCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-gray-700">סטטוס המתנדב:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(currentVolunteerStatus || 'לא זמין')}`}>
            {currentVolunteerStatus || 'לא זמין'}
          </span>
        </div>

        {responseTime && (
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">זמן תגובה:</span>
            <span className="text-gray-600">{responseTime}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      {currentVolunteerStatus === 'going' && (
        <div className="border-t pt-4">
          <button
            onClick={handleArrivedClick}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isLoading ? 'מעדכן...' : 'הגעתי לזירה'}
          </button>
        </div>
      )}
    </div>
  );
};

// Demo Component
const Demo: React.FC = () => {
  const mockCall: Call = {
    id: 12345,
    address: "רחוב הרצל 45, תל אביב",
    description: "דיווח על אירוע חירום בבניין מגורים - עשן יוצא מהחלון בקומה השנייה",
    priority: "גבוה",
    timestamp: "2024-07-09T10:30:00Z",
    status: "פעיל",
    type: "חירום"
  };

  const mockVolunteerCall: VolunteerCall = {
    callsId: 12345,
    volunteerId: 67890,
    volunteerStatus: "going",
    responseTime: "2 דקות",
    call: mockCall,
    goingVolunteersCount: 3
  };

  return (
    <BackgroundLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          כרטיס קריאה פעילה
        </h1>
        <ActiveCallCard volunteerCall={mockVolunteerCall} onStatusUpdate={() => {}} />
      </div>
    </BackgroundLayout>
  );
};

export default Demo;