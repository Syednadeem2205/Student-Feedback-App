import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyFeedback from "./pages/MyFeedback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourse from "./pages/AdminCourse";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const userRole = user?.role || null;

  // Optional: listen to localStorage changes (e.g., login/signup/logout)
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/dashboard"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/dashboard"} />
            )
          }
        />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated && userRole === "student" ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated && userRole === "student" ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/myfeedback"
          element={isAuthenticated && userRole === "student" ? <MyFeedback /> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={isAuthenticated && userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/courses"
          element={isAuthenticated && userRole === "admin" ? <AdminCourse /> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? userRole === "admin"
                ? <AdminDashboard />
                : <Dashboard />
              : <Navigate to="/login" />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
