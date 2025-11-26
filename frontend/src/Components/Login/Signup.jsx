import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext/AuthContext";

export default function Signup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const mobile = state?.mobile || ""; // optional now
  const initialRole = state?.role === "seller" ? "seller" : "buyer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(""); // optional
  const [role, setRole] = useState(initialRole);
  const [shopName, setShopName] = useState("");

  const backendURL = "http://localhost:4000";

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${backendURL}/auth/signup`, {
        mobile: mobile ? "+91" + mobile : "", // optional
        name,
        email,
        password,
        address: address || "", // optional
        role,
        shopName: role === "seller" ? shopName : undefined,
      });

      login(res.data.user, res.data.token);

      if (role === "buyer") navigate("/");
      if (role === "seller") navigate("/seller-dashboard");
    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  return (
    <div>
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="container mt-5">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "450px", margin: "auto" }}>
          <h3 className="text-center mb-3">Create Account</h3>

          {mobile && (
            <p className="text-center text-muted">Mobile: +91 {mobile}</p>
          )}

          <form onSubmit={handleSignup}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Full Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <textarea
              className="form-control mb-3"
              placeholder="Full Address (Optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label className="mb-1"><b>Select Role*</b></label>
            <select
              className="form-select mb-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="buyer">Customer</option>
              <option value="seller">Restaurant / Seller</option>
            </select>

            {role === "seller" && (
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Restaurant / Shop Name*"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            )}

            <button className="btn btn-success w-100">Create Account</button>
          </form>

          <div className="text-center mt-2">
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", color: "#007bff" }}
            >
              Back to Login
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
