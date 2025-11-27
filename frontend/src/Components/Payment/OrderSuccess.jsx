import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);

  // Data passed from Payment.jsx
  const navState = location.state;

  // Load order from Firestore when page refreshes
  useEffect(() => {
    const loadOrder = async () => {

      // ⭐ If Payment.jsx passed data → use instantly
      if (navState?.orderId) {
        setOrderData(navState);
        return;
      }

      // ⭐ Fallback (if refreshed)
      const fallbackOrderId = localStorage.getItem("apnaSwad_last_order");
      if (!fallbackOrderId) return;

      const ref = doc(db, "orders", String(fallbackOrderId));
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setOrderData({ orderId: fallbackOrderId, ...snap.data() });
      }
    };

    loadOrder();
  }, [navState]);

  // ❌ Still loading or missing data
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

  // ⭐ Extract fields
  const {
    orderId,
    totalPrice,
    total,
    address,
    paymentMethod
  } = orderData;

  const finalTotal = totalPrice || total;

  // ⭐ Tracking uses SAME orderId (same as Firestore doc ID)
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
          <p><b>Total Paid:</b> ₹{finalTotal}</p>
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
