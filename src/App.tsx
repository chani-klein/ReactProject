import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterVolunteerPage from "./pages/RegisterVolunteerPage";
import CreateCallPage from "./pages/CreateCallPage";
import EmergencyPage from "./pages/EmergencyPage";
import LoginPage from "./pages/LoginPage";
import InitializedAuth from "./InitializedAuth";
import CallConfirmationPage from "./pages/CallConfirmationPage";
import VolunteerListPage from "./pages/VolunteerListPage"; // דף רשימת מתנדבים
 import VolunteerPage from "./pages/volunteerPage"; // דף התראות בזמן אמת

function App() {
  return (
    <Router>
      <InitializedAuth />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/register-user" element={<RegisterUserPage />} />
        <Route path="/register-volunteer" element={<RegisterVolunteerPage />} />
        <Route path="/create-call" element={<EmergencyPage />} />
        <Route path="/create-call-page" element={<CreateCallPage />} />
        <Route path="/call-confirmation" element={<CallConfirmationPage />} />
        <Route path="/VolunteerListPage" element={<VolunteerListPage />} />
        <Route path="/volunteerPage" element={<VolunteerPage />} /></Routes>
    </Router>
  );
}

export default App;
