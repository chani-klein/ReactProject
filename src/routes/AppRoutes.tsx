import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import { LoginPage } from '../pages/LoginPage';
// import RegisterVolunteer from '../pages/RegisterVolunteer';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-user" element={<LoginPage />} />
      {/* <Route path="/register-volunteer" element={<RegisterVolunteer />} /> */}


    </Routes>
  );
};

export default AppRoutes;
