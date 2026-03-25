import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("admin", JSON.stringify(res.data));
      setPage("dashboard");

    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">

      {/* Left Side */}
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon">🍽️</span>
          <h1>FoodEase</h1>
          <p>Admin Control Panel</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-card">

          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to manage your restaurant</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="admin@foodease.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;