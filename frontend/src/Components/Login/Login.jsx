import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { login, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLoginPage = location.pathname === "/admin-auth";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚫 Prevent auto redirect on /admin-auth until admin logs in
  useEffect(() => {
    if (!user) return;

    // If user is customer but on admin-auth → do nothing
    if (isAdminLoginPage && role !== "admin") return;

    // Normal redirect
    if (role === "admin") navigate("/admin/dashboard", { replace: true });
    else navigate("/", { replace: true });
  }, [user, role, isAdminLoginPage, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userRole = await login(email.trim(), password.trim());

      // ❌ Customer trying to login on admin page
      if (isAdminLoginPage && userRole !== "admin") {
        setError("❌ You are not authorized for the admin dashboard");
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (userRole === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });

    } catch (err) {
      console.error("Login Error:", err);

      if (err.code === "auth/user-not-found") setError("User not found");
      else if (err.code === "auth/wrong-password") setError("Wrong password");
      else if (err.code === "auth/invalid-email") setError("Invalid email format");
      else setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleLogin}>
        <h2 className="login-title">
          {isAdminLoginPage ? "👨‍💼 Admin Login" : "🍽 Welcome to ApnaSwad"}
        </h2>

        <p className="login-subtitle">
          {isAdminLoginPage
            ? "Login to access restaurant admin dashboard"
            : "Login to continue ordering food"}
        </p>

        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <input
          type="email"
          className="input-field"
          placeholder={isAdminLoginPage ? "Enter Admin Email" : "Enter Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          className="input-field"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Logging in..." : "🔐 Login"}
        </button>

        {/* Hide signup/forgot links on admin page */}
        {!isAdminLoginPage && (
          <div className="extra-links">
            <a href="/signup">Create New Account</a>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        )}
      </form>
    </div>
  );
}
