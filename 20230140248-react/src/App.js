import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./pages/Navbar";  
import AttendancePage from "./pages/Presensi";
import ReportPage from "./pages/Reports";

function App() {
  return (
    <Router>
      <div>
        {/* Hapus navigasi lama jika ada, dan ganti dengan Navbar */}
        {/* <nav className="p-4 bg-gray-100">
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/register">Register</Link>
        </nav> */}
        
        {/* Tampilkan Navbar di luar Routes */}
        <Navbar /> 
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;
