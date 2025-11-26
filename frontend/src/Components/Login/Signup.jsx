import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { createAccount } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Signup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const mobile = state?.mobile || ""; // optional now
  const initialRole = state?.role === "seller" ? "seller" : "buyer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(""); // optional
  const [role, setRoleState] = useState(initialRole);
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createAccount(email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      const userData = {
        email,
        name,
        mobile: mobile ? "+91" + mobile : "",
        address: address || "",
        role: role,
        createdAt: new Date().toISOString(),
      };

      if (role === "seller") {
        userData.shopName = shopName;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      // Update auth context
      setUser(user);
      setRole(role);

      // Navigate based on role
      if (role === "buyer") navigate("/");
      if (role === "seller") navigate("/seller");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
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

          {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

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
              onChange={(e) => setRoleState(e.target.value)}
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

            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
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
