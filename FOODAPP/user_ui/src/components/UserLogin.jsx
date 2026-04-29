import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Login({ setPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${API}/user/login`, {
          email,
          password,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setPage("dashboard");
      } else {
        const res = await axios.post(`${API}/user/register`, {
          name,
          email,
          password,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setPage("dashboard");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon">🍽️</span>
          <h1>FoodEase</h1>
          <p>Delicious food, delivered fast</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-tabs">
            <button className={isLogin ? "tab active" : "tab"}
              onClick={() => { setIsLogin(true); setError(""); }}>
              Login
            </button>
            <button className={!isLogin ? "tab active" : "tab"}
              onClick={() => { setIsLogin(false); setError(""); }}>
              Register
            </button>
          </div>

          <h2>{isLogin ? "Welcome back!" : "Create account"}</h2>
          <p className="login-subtitle">
            {isLogin ? "Sign in to order your favourite food" : "Join FoodEase today"}
          </p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="field-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe"
                  value={name} required onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="field-group">
              <label>Email</label>
              <input type="email" placeholder="you@email.com"
                value={email} required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••"
                value={password} required onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;