// src/layouts/PageLayout.tsx
import { ReactNode } from "react";
import "./PageLayout.css";
import GlobalVolunteerCallWatcher from "../components/GlobalVolunteerCallWatcher";

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="page-layout">
      <GlobalVolunteerCallWatcher />
      <div className="page-container">
        {children}
      </div>
    </div>
  );
}
