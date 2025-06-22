// src/layouts/PageLayout.tsx
import { ReactNode } from "react";
import "./PageLayout.css";

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="page-layout">
      <div className="page-container">
        {children}
      </div>
    </div>
  );
}
