import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);

  // Get data from navigation state (if coming from Payment)
  const navState = location.state;

  // If order page refreshed → load data from Firebase
  useEffect(() => {
    const loadOrder = async () => {
      if (navState?.orderId) {
        setOrderData(navState);
        return;
      }

      // Try fallback using last saved order ID
      const lastOrder = localStorage.getItem("apnaSwad_last_order");
      if (!lastOrder) return;

      const q = query(collection(db, "orders"), where("orderId", "==", Number(lastOrder)));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setOrderData(snap.docs[0].data());
      }
    };
    loadOrder();
  }, [navState]);

  // Redirect to home if still no data
  if (!orderData) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 50 }}>
        Order information not found ❌ <br />
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 20,
            background: "#ff6600",
            padding: "10px 20px",
            borderRadius: 6,
            color: "#fff",
          }}
        >
          Go Back Home
        </button>
      </h2>
    );
  }

  const { orderId, totalPrice, address, paymentMethod } = orderData;

  const goToTracking = () => {
    navigate(`/order-tracking/${orderId}`);
  };

  return (
    <div className="order-success-wrapper">
      <div className="order-card">
        <div className="success-icon">✔</div>

        <h2 className="success-title">Order Placed Successfully! 🎉</h2>

        <div className="order-details">
          <p><b>Order ID:</b> {orderId}</p>
          <p><b>Total Paid:</b> ₹{totalPrice}</p>
          <p><b>Payment Mode:</b> {paymentMethod?.toUpperCase()}</p>
          <p><b>Delivery Address:</b> {address}</p>
          <p className="time-text">⏳ Estimated delivery in 35 – 45 minutes</p>
        </div>

        <button className="track-btn" onClick={goToTracking}>
          🚚 Track My Order
        </button>
      </div>
    </div>
  );
}
