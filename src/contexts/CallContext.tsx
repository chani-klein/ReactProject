
import React, { useState, useEffect, useContext, createContext } from 'react';

// טיפוס עבור ערך הקונטקסט (אפשר להחליף any בטיפוס מותאם)
interface CallContextType {
  popupCall: any;
  setPopupCall: React.Dispatch<React.SetStateAction<any>>;
}

// יצירת קונטקסט
const CallContext = createContext<CallContextType | null>(null);

// קומפוננטת Provider עוטפת את כל האפליקציה
export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const [popupCall, setPopupCall] = useState<any | null>(null);

  return (
    <CallContext.Provider value={{ popupCall, setPopupCall }}>
      {children}
    </CallContext.Provider>
  );
};

// ההוק לשימוש בקונטקסט
export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext חייב להיות בשימוש בתוך CallProvider");
  }
  return context;
};

