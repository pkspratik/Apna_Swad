import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";
import "./UserProfile.css";
import { useCart } from "../../context/CartContext";

export function UserProfile() {
  const { user, logout } = useAuth();
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // ⭐ Fetch user profile safely
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserProfile(snap.data());
        }
      } catch (err) {
        console.error("User profile error:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // ⭐ Fetch Orders (FULLY FIXED for Safari)
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "orders"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Sort latest first (fallback safe)
        list.sort((a, b) => {
          const A = a.createdAt?.seconds || 0;
          const B = b.createdAt?.seconds || 0;
          return B - A;
        });

        setOrders(list);
        setLoading(false);
      },
      (err) => {
        console.error("Order fetch error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getStatusColor = (s) => {
    switch (s) {
      case "Delivered":
        return "#00b341";
      case "Cancelled":
        return "#e30000";
      case "Out for Delivery":
        return "#ff5500";
      case "Preparing Food":
        return "#ff9d00";
      case "Accepted by Restaurant":
        return "#0099ff";
      default:
        return "#6d6dff";
    }
  };

  const reorder = (items) => {
    clearCart();
    items.forEach((item) => addToCart(item));
    navigate("/cart");
  };

  if (!user) return null;

  return (
    <div>
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="user-profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userProfile?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-info">
            <h2>{userProfile?.name}</h2>
            <p>{userProfile?.email || user.email}</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* ===================== TABS ======================== */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile Details
          </button>

          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Order History
          </button>
        </div>

        {/* ===================== PROFILE TAB ======================== */}
        {activeTab === "profile" && (
          <div className="profile-details-section">
            <div className="detail-card">
              <h3>Personal Information</h3>

              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{userProfile?.name}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userProfile?.email}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{userProfile?.mobile}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{userProfile?.address}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Account Type:</span>
                <span className="detail-value">
                  {userProfile?.role === "buyer" ? "Customer" : userProfile?.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== ORDERS TAB ======================== */}
        {activeTab === "orders" && (
          <div className="order-history-section">
            <h3>Your Order History</h3>

            {loading ? (
              <p className="loading-text">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>📭 No orders yet</p>
                <button className="browse-btn" onClick={() => navigate("/")}>
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <p className="order-id">Order #{order.orderId}</p>

                        <p className="order-date">
                          {order.createdAt?.seconds
                            ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                            : "—"}
                        </p>
                      </div>

                      <div
                        className="order-status-badge"
                        style={{ background: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </div>
                    </div>

                    <div className="order-items">
                      <strong>Items:</strong>
                      <ul>
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.qty}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <span className="total-amount">₹{order.total}</span>
                      </div>

                      <span
                        className="payment-badge"
                        style={{
                          background:
                            order.paymentMethod?.toLowerCase() === "upi"
                              ? "#00b341"
                              : "#007bff",
                        }}
                      >
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                    </div>

                    <div className="order-address">
                      <strong>Address:</strong> {order.address || "—"}
                    </div>

                    <div className="order-actions">
                      <button
                        className="track-order-btn"
                        onClick={() => navigate(`/order-tracking/${order.id}`)} // ⭐ fixed
                      >
                        🔍 Track Order
                      </button>

                      <button
                        className="reorder-btn"
                        onClick={() => reorder(order.items)}
                      >
                        🔁 Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
