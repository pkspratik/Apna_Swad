import React, { useEffect, useState } from "react";
import "./OrderTracking.css";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const steps = [
  "Order Placed",
  "Accepted by Restaurant",
  "Preparing Food",
  "Out for Delivery",
  "Delivered",
];

export function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [lastStatus, setLastStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ⭐ Load order without login – public tracking
  const loadOrder = async () => {
    try {
      const orderRef = doc(db, "orders", String(orderId));
      const snap = await getDoc(orderRef);

      if (!snap.exists()) {
        setOrder(null);
        setLoading(false);
        return;
      }

      const data = snap.data();

      setOrder(data);

      // Play sound when status changes
      if (data.status !== lastStatus) {
        setLastStatus(data.status);
        const audio = document.getElementById("statusSound");
        audio?.play().catch(() => { });
      }

      // ETA calculation
      if (data.createdAt?.toDate) {
        const start = data.createdAt.toDate().getTime();
        const now = Date.now();
        const diffMin = Math.floor((now - start) / (1000 * 60));
        setEtaMinutes(Math.max(45 - diffMin, 0));
      }
    } catch (err) {
      console.error("Order tracking error:", err);
      setOrder(null);
    }

    setLoading(false);
  };

  // 🔁 Auto refresh every 4 seconds
  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  // ⭐ Auto Clear Cart When Delivered
  useEffect(() => {
    if (order?.status === "Delivered") {
      clearCart(); // empty cart instantly
    }
  }, [order?.status]);

  // UI Handling
  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>Loading order details...</h3>;
  }

  if (!order) {
    return (
      <h3 style={{ textAlign: "center", marginTop: 40 }}>
        Order not found 🚫 <br />
        <button onClick={() => navigate("/")} style={{ marginTop: 20 }}>
          Go Home
        </button>
      </h3>
    );
  }

  const currentIndex = steps.findIndex((s) => s === order.status);

  return (
    <div className="tracking-container">
      <audio id="statusSound" src="/order_update.mp3" preload="auto"></audio>

      <h2 className="tracking-title">🚚 Live Order Tracking</h2>

      <p><b>Order ID:</b> {orderId}</p>
      <p><b>Total:</b> ₹{order.total}</p>

      {etaMinutes !== null && order.status !== "Delivered" && (
        <p className="eta-time">⏳ Arriving in approx <b>{etaMinutes} min</b></p>
      )}

      <p className="tracking-address">📍 <b>Address:</b> {order.address}</p>

      {order.status === "Out for Delivery" && (order.boyName || order.boyPhone) && (
        <p>🛵 <b>Delivery Partner:</b> {order.boyName} ({order.boyPhone})</p>
      )}

      <div className="steps-wrapper">
        {steps.map((step, index) => (
          <div key={step} className={`step ${index <= currentIndex ? "step-active" : ""}`}>
            <div className="step-circle">{index + 1}</div>
            <p className="step-label">{step}</p>
          </div>
        ))}
      </div>

      {order.status === "Delivered" && (
        <button
          onClick={() => navigate("/")}
          className="reorder-btn"
        >
          🔁 Re-Order
        </button>
      )}
    </div>
  );
}
