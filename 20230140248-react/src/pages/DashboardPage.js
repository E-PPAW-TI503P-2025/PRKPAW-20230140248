import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p style={{ textAlign: "center" }}>Selamat datang di halaman dashboard 🎉</p>

      <button style={{ background: "#E74C3C" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
