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

  const initialRole = state?.role === "seller" ? "seller" : "buyer";

  // ⭐ Now mobile number always required
  const [mobile, setMobile] = useState(state?.mobile || "");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRoleState] = useState(initialRole);
  const [shopName, setShopName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateMobile = (num) => /^[0-9]{10}$/.test(num);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    try {
      // Create Firebase Auth Account
      const userCredential = await createAccount(email, password);
      const user = userCredential.user;

      // Create Firestore user data
      const userData = {
        uid: user.uid,
        name,
        email,
        mobile: "+91" + mobile,
        address,
        role,
        createdAt: new Date().toISOString(),
      };

      if (role === "seller") {
        userData.shopName = shopName;
      }

      // Save Firestore User Profile
      await setDoc(doc(db, "users", user.uid), userData);

      // Update context
      setUser(user);
      setRole(role);

      // Redirect user
      if (role === "buyer") navigate("/");
      if (role === "seller") navigate("/seller-dashboard");
    } catch (err) {
      console.error("Signup error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Signup failed. Try again.");
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

          {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Mobile Number */}
            <input
              type="tel"
              className="form-control mb-3"
              placeholder="Mobile Number *"
              maxLength="10"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
              required
            />

            {/* Email */}
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Full Address */}
            <textarea
              className="form-control mb-3"
              placeholder="Your Full Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            {/* Select role */}
            <label><b>Select Role *</b></label>
            <select
              className="form-select mb-3"
              value={role}
              onChange={(e) => setRoleState(e.target.value)}
              required
            >
              <option value="buyer">Customer</option>
              <option value="seller">Restaurant / Seller</option>
            </select>

            {/* Seller Shop Name */}
            {role === "seller" && (
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Restaurant / Shop Name *"
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
