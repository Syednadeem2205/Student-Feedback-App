import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyFeedback from "./pages/MyFeedback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourse from "./pages/AdminCourse";

export default function App() {
  const token = localStorage.getItem("token");
  const userRole = JSON.parse(localStorage.getItem("user"))?.role || null;
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/dashboard"} />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/dashboard"} />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={isAuthenticated && userRole === "student" ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated && userRole === "student" ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/myfeedback" element={isAuthenticated && userRole === "student" ? <MyFeedback /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={isAuthenticated && userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/courses" element={isAuthenticated && userRole === "admin" ? <AdminCourse /> : <Navigate to="/login" />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
