import { BrowserRouter, Routes, Route } from "react-router";
import RegisterUserPage from "./pages/RegisterUserPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}
