import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterVolunteerPage from "./pages/RegisterVolunteerPage";
import EmergencyPage from "./pages/EmergencyPage";
import CreateCallPage from "./pages/CreateCallPage";
import CallConfirmationPage from "./pages/CallConfirmationPage";
import VolunteerPage from "./pages/volunteerPage";
import VolunteerListPage from "./pages/VolunteerListPage";
import VolunteerUpdatePage from "./pages/VolunteerUpdatePage";
import ActiveCallsPage from "./pages/VolunteerActiveCallsPage";
import HistoryPage from "./pages/VolunteerCallHistoryPage";


import VolunteerCallWatcher from "./components/VolunteerCallWatcher";
import { CallProvider } from "./contexts/CallContext";
import AuthRedirector from "./components/AuthRedirector"; // ✅ ההפניה האוטומטית לפי טוקן

function App() {
  return (
    <CallProvider>
      <Router>
        <VolunteerCallWatcher />
       

        <Routes>
          {/* ✅ הפניה חכמה עם AuthRedirector */}
          <Route path="/" element={<AuthRedirector />} />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/register-user" element={<RegisterUserPage />} />
          <Route path="/register-volunteer" element={<RegisterVolunteerPage />} />
          <Route path="/create-call" element={<EmergencyPage />} />
          <Route path="/CreateCallPage" element={<CreateCallPage />} />
          <Route path="/call-confirmation" element={<CallConfirmationPage />} />
          <Route path="/volunteerPage" element={<VolunteerPage />} />
          <Route path="/VolunteerListPage" element={<VolunteerListPage />} />
          <Route path="/volunteer/update-details" element={<VolunteerUpdatePage />} />
          <Route path="/volunteer/active-calls" element={<ActiveCallsPage />} />
          <Route path="/volunteer/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    </CallProvider>
  );
}

export default App;
