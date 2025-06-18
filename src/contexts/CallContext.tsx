import { createContext, useContext, useState } from "react";

const CallContext = createContext<any>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCall, setActiveCall] = useState<any | null>(null);

  const showCallPopup = (call: any) => setActiveCall(call);
  const clearCallPopup = () => setActiveCall(null);

  return (
    <CallContext.Provider value={{ activeCall, showCallPopup, clearCallPopup }}>
      {children}
    </CallContext.Provider>
  );
};
export const useCallContext = () => useContext(CallContext);