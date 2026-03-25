import './App.css'
import LoginPage from './components/login'
import StudentDashboard from './components/student/dashboard'

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes> {/* ✅ THIS WAS MISSING */}
    </BrowserRouter>
  );
}

export default App;