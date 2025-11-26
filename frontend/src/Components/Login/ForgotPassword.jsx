import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", margin: "auto" }}
      >
        <h3 className="text-center mb-3">Forgot Password</h3>

        {message && <p style={{ color: "green", marginBottom: 10 }}>{message}</p>}
        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login">⬅ Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
