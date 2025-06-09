// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterVolunteerPage from "./pages/RegisterVolunteerPage";
import CreateCallPage from "./pages/CreateCallPage";
import EmergencyPage from "./pages/EmergencyPage";
import LoginPage from "./pages/LoginPage"; // ✅ דף התחברות
import InitializedAuth from "./InitializedAuth"; // ✅ הפניה אוטומטית לפי טוקן
import CallConfirmationPage from "./pages/CallConfirmationPage";

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

      </Routes>
    </Router>
  );
}

export default App;
