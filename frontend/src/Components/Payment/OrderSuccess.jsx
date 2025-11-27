import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);

  // Data passed from Payment.jsx (recommended path)
  const navState = location.state;

  // Load order if page refreshed or opened later
  useEffect(() => {
    const loadOrder = async () => {
      // If Payment.jsx passed all details → use it
      if (navState?.docId) {
        setOrderData(navState);
        return;
      }

      // Fallback (page refresh)
      const savedDocId = localStorage.getItem("apnaSwad_last_order_doc");

      if (!savedDocId) return;

      const snap = await getDoc(doc(db, "orders", savedDocId));

      if (snap.exists()) {
        setOrderData({ docId: savedDocId, ...snap.data() });
      }
    };

    loadOrder();
  }, [navState]);

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

  const { orderId, total, address, paymentMethod, docId } = orderData;

  const goToTracking = () => {
    navigate(`/order-tracking/${docId}`); // ⭐ FIXED (use Firebase document ID)
  };

  return (
    <div className="order-success-wrapper">
      <div className="order-card">
        <div className="success-icon">✔</div>

        <h2 className="success-title">Order Placed Successfully! 🎉</h2>

        <div className="order-details">
          <p><b>Order ID:</b> {orderId}</p>
          <p><b>Total Paid:</b> ₹{total}</p>
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
