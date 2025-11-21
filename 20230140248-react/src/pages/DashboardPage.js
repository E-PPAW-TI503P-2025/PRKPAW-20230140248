import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("role") === "admin";

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
// make this html a navbar
    <div className="container">
      <h2>Dashboard</h2>
      <nav>  
        <ul>  
          <li>
            <button onClick={() => navigate("/attendance")}>Presensi</button>
          </li>
          <li>
            <button onClick={() => navigate("/reports")}>Laporan</button>
          </li>
          {isAdmin && (
            <li>
              <button onClick={() => navigate("/register")}>Tambah Mahasiswa</button>
            </li>
          )}
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
    
  );
}
