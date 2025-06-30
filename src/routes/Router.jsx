// routes/Router.jsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
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
    path: "/call-confirmation",
    element: <CallConfirmationPage />,
  },
  {
    path: "/volunteerPage",
    element: <VolunteerPage />,
  },
  {
    path: "/VolunteerListPage",
    element: <VolunteerListPage />,
  },
  {
    path: "/volunteer/update-details",
    element: <VolunteerUpdatePage />,
  },
  {
    path: "/volunteer/active-calls",
    element: <ActiveCallsPage />,
  },
  {
    path: "/volunteer/history",
    element: <HistoryPage />,
  },
  {
    path: "/volunteer/menu",
    element: <VolunteerMenu />,
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
  {
  path: "/my-calls",
  element: <MyCallsPage />,
},
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
