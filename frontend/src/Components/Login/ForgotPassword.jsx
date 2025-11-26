import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const backendURL = "http://localhost:4000"; // change if needed
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return alert("Enter admin email");

    setLoading(true);
    try {
      await axios.post(`${backendURL}/auth/admin-forgot`, { email });
      alert("Temporary password sent to your admin email!");
    } catch (err) {
      alert("Invalid email. Admin not found.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", margin: "auto" }}
      >
        <h3 className="text-center mb-3">Admin Forgot Password</h3>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter admin email"
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
