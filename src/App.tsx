import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import RegisterUserPage from "./pages/RegisterUserPage";
import RegisterVolunteerPage from "./pages/RegisterVolunteerPage";
import CreateCallPage from "./pages/CreateCallPage";
import EmergencyPage from "./pages/EmergencyPage";

// import RegisterVolunteerPage from "./pages/RegisterVolunteerPage"; // תכיני גם את זה

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-user" element={<RegisterUserPage />} />
      <Route path="/register-volunteer" element={<RegisterVolunteerPage />} />
       <Route path="/create-call" element={<EmergencyPage />} />
        <Route path="/create-callPage" element={<CreateCallPage />} />
      
      </Routes>
    </Router>
  );
}

export default App;

