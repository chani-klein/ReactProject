import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Emergency from './pages/Emergency'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emergency" element={<Emergency />} />
      </Routes>
    </Router>
  )
}

export default App
