// App.jsx
import VolunteerCallWatcher from "./components/VolunteerCallWatcher";
import CallPopupModal from "./components/CallPopupModal";
import { CallProvider } from "./contexts/CallContext";
import AppRouter from "./routes/Router"; // הנתיב החדש שלך

function App() {
  return (
    <CallProvider>
      <VolunteerCallWatcher />
      <CallPopupModal />
      <AppRouter />
    </CallProvider>
  );
}

export default App;
