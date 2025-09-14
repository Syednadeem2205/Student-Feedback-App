import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyFeedback from "./pages/MyFeedback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourse from "./pages/AdminCourse";

// Simulated Auth + Role
const isAuthenticated = true;   
const userRole = "admin";       

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
