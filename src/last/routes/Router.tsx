import { BrowserRouter, Routes, Route } from 'react-router'
import CallPage from '../pages/CallPage'

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/calls/:id" element={<CallPage />} />
    </Routes>
  </BrowserRouter>
)

export default Router
