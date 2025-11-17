import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Server error!");
    }
  };

  return (
    <div className="container">
      <h2>Login Akun</h2>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Masuk</button>
      </form>

      <p style={{ textAlign: "center", marginTop: 15 }}>
        Belum punya akun? <a href="/register">Daftar</a>
      </p>
    </div>
  );
}
