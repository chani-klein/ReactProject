// routes/Router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/Volunteer/LoginPage";
import RegisterUserPage from "../pages/User/RegisterUserPage";
import RegisterVolunteerPage from "../pages/Volunteer/RegisterVolunteerPage";
import EmergencyPage from "../pages/Call/EmergencyPage";
import CreateCallPage from "../pages/Call/CreateCallPage";
import CallConfirmationPage from "../pages/Call/CallConfirmationPage";
import VolunteerPage from "../pages/Volunteer/volunteerPage";
import VolunteerListPage from "../pages/Volunteer/VolunteerListPage";
import VolunteerUpdatePage from "../pages/Volunteer/VolunteerUpdatePage";
import ActiveCallsPage from "../pages/Volunteer/VolunteerActiveCallsPage";
import HistoryPage from "../pages/Volunteer/VolunteerCallHistoryPage";
import AuthRedirector from "../components/AuthRedirector";
import VolunteerMenu from "../pages/Volunteer/volunteerPage";
import MyCallsPage from "../pages/Call/MyCallsPage";
import UnifiedVolunteerCallWatcher from "../components/GlobalVolunteerCallWatcher";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirector />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/user/register",
    element: <RegisterUserPage />,
  },
  {
    path: "/volunteer/register", 
    element: <RegisterVolunteerPage />,
  },
  {
    path: "/register-user",
    element: <RegisterUserPage />,
  },
  {
    path: "/register-volunteer",
    element: <RegisterVolunteerPage />,
  },
  {
    path: "/create-call",
    element: <EmergencyPage />,
  },
  {
    path: "/CreateCallPage",
    element: <CreateCallPage />,
  },
  {
    path: "/call-confirmation/:callId",
    element: <CallConfirmationPage />,
  },
  {
    path: "/volunteerPage",
    element: <><UnifiedVolunteerCallWatcher /><VolunteerPage /></>,
  },
  {
    path: "/VolunteerListPage",
    element: <><UnifiedVolunteerCallWatcher /><VolunteerListPage /></>,
  },
  {
    path: "/volunteer/update-details",
    element: <><UnifiedVolunteerCallWatcher /><VolunteerUpdatePage /></>,
  },
  {
    path: "/volunteer/active-calls",
    element: <><UnifiedVolunteerCallWatcher /><ActiveCallsPage /></>,
  },
  {
    path: "/volunteer/history",
    element: <><UnifiedVolunteerCallWatcher /><HistoryPage /></>,
  },
  {
    path: "/volunteer/menu",
    element: <><UnifiedVolunteerCallWatcher /><VolunteerMenu /></>,
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
  {
    path: "/my-calls",
    element: <><UnifiedVolunteerCallWatcher /><MyCallsPage /></>,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
