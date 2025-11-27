import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";
import "./UserProfile.css";

export function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile or orders

  // Fetch user profile data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  // Fetch user orders in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "orders"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by creation date (newest first)
      ordersList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    // Navigate to products page with items
    navigate("/product");
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="user-profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userProfile?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="profile-info">
            <h2>{userProfile?.name || "User"}</h2>
            <p>{userProfile?.email || user.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
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

        {/* Profile Details Tab */}
        {activeTab === "profile" && (
          <div className="profile-details-section">
            <div className="detail-card">
              <h3>Personal Information</h3>
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{userProfile?.name || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userProfile?.email || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{userProfile?.mobile || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{userProfile?.address || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Type:</span>
                <span className="detail-value">
                  {userProfile?.role === "buyer" ? "Customer" : userProfile?.role || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === "orders" && (
          <div className="order-history-section">
            <h3>Your Order History</h3>

            {loading ? (
              <p className="loading-text">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>📭 No orders yet</p>
                <button className="browse-btn" onClick={() => navigate("/product")}>
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
                          {order.createdAt
                            ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                            : "N/A"}
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
                      <p className="items-label">Items:</p>
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
                      <div className="order-payment">
                        <span
                          className="payment-badge"
                          style={{
                            background: order.paymentMethod === "upi" ? "#00b341" : "#007bff",
                          }}
                        >
                          {order.paymentMethod?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {order.address && (
                      <div className="order-address">
                        <strong>Delivery Address:</strong> {order.address}
                      </div>
                    )}

                    <div className="order-actions">
                      <button
                        className="track-order-btn"
                        onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                      >
                        🔍 Track Order
                      </button>
                      <button className="reorder-btn" onClick={() => reorder(order.items)}>
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
