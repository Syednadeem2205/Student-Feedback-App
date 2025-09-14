import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup'; // <- Check this
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyFeedback from './pages/MyFeedback';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/MyFeedback" element={<PrivateRoute><MyFeedback /></PrivateRoute>} />
          <Route path="/Profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/Admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/Admin/courses" element={<PrivateRoute><AdminCourses /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  );
}
