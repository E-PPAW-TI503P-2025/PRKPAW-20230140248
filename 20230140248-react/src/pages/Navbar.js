import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const COLORS = {
  darkplum: "#5e548e", // Ungu Gelap (Background)
  lilac: "#be95c4",   // Lilac (Tombol Logout)
  skyblue: "#a3c1cd", // Biru Langit (Aksen)
  white: "#ffffff",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Ambil user. Jika token ada, coba decode. Jika decode gagal, user tetap null.
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (e) {
      // Jika decoding gagal (token rusak/expired), token dihapus dan diarahkan ke login
      console.error("Token decoding failed:", e);
      localStorage.removeItem("token");
      navigate("/login");
      return null;
    }
  }

  // JANGAN TAMPILKAN Navbar jika pengguna belum login atau token invalid
  if (!user) {
    return null; 
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLaporan = (e) => {
    if (user?.role !== 'admin') {
      e.preventDefault();
      // Ganti alert() dengan pesan di konsol atau custom modal
      console.error("Akses ditolak. Hanya admin yang dapat mengakses halaman laporan.");
      
      // Sebagai feedback sementara di UI, bisa gunakan pop-up sederhana (jika ada custom modal)
      // Untuk saat ini, kita hanya blok navigasinya.
      return;
    }
    // Navigasi dilakukan oleh <Link to="/report"> jika tidak diblok oleh e.preventDefault()
  };
  
  const NavLink = ({ to, children, onClick }) => {
      const isActive = location.pathname === to;
      return (
          <Link
              to={to}
              onClick={onClick}
              className={`text-sm font-semibold transition duration-150 relative pb-1 mx-2 ${
                  isActive
                      ? "text-white"
                      : "text-white opacity-80 hover:opacity-100"
              }`}
          >
              {children}
              {isActive && (
                  <span
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                      style={{ backgroundColor: COLORS.lilac }}
                  />
              )}
          </Link>
      );
  };

  return (
    <nav 
        className="w-full p-4 sticky top-0 z-50 shadow-xl" 
        style={{ 
            background: COLORS.darkplum,
            color: COLORS.white 
        }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo/Nama Aplikasi */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="text-xl font-bold flex items-center" style={{ color: COLORS.white }}>
            {/* Ikon: Rose/Lilac untuk kontras */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                <circle cx="8" cy="8" r="3" fill={COLORS.lilac} />
                <rect x="6" y="13" width="12" height="6" rx="3" fill={COLORS.lilac} />
            </svg>
            App Presensi
          </Link>
        </div>

        {/* Navigasi Utama */}
        <div className="flex items-center">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/attendance">Presensi</NavLink>
            <NavLink 
                to="/report" 
                onClick={handleLaporan}
                // Tambahkan style untuk disabled state jika bukan admin
                className={`${user.role !== 'admin' ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                Laporan
            </NavLink>
        </div>

        {/* Info User dan Logout */}
        <div className="flex items-center space-x-4">
          <p className="text-sm font-semibold" style={{ color: COLORS.lilac }}>
            {user?.nama ?? "User"} ({user?.role ?? "-"})
          </p>
          <button
            onClick={handleLogout}
            className="py-1 px-3 rounded-md text-sm font-semibold transition duration-200 hover:bg-opacity-90"
            style={{ background: COLORS.lilac, color: COLORS.darkplum }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}