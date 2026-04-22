import "./App.css";

import LoginPage from "./components/login";
import Register from "./components/register";
import StudentDashboard from "./components/student/dashboard";
import AdminDashboard from "./components/admin/Dashboard";
import CompanyDashboard from "./components/company/dashboard"; // 🔥 ADD

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔥 PROTECTED ROUTE COMPONENT
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔹 Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* 🔹 Student */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Company */}
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;