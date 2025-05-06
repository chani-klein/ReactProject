import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RegisterUser from '../pages/RegisterUser';
import RegisterVolunteer from '../pages/RegisterVolunteer';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-volunteer" element={<RegisterVolunteer />} />
    </Routes>
  );
};

export default AppRoutes;
