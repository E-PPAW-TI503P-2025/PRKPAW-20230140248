import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { nama, email, password, role };

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil!");
        navigate("/login");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan server.");
    }
  };

  return (
    <div className="container">
      <h2>Registrasi Akun</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama Lengkap</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Pilih Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit">Daftar</button>
      </form>

      <p style={{ textAlign: "center", marginTop: 15 }}>
        Sudah punya akun? <a href="/login">Login</a>
      </p>
    </div>
  );
}
