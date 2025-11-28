import React, { useEffect, useState } from "react";
import "./OrderTracking.css";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

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

  const [order, setOrder] = useState(null);
  const [docId, setDocId] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [lastStatus, setLastStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // ⭐ Find the actual Firestore doc ID by orderId
  const findFirestoreDoc = async () => {
    try {
      // Try numeric orderId first (backend API orders)
      const numericOrderId = Number(orderId);

      if (!isNaN(numericOrderId)) {
        const q = query(
          collection(db, "orders"),
          where("orderId", "==", numericOrderId)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
          const d = snap.docs[0];
          setDocId(d.id);
          return d.id;
        }
      }

      // Fallback: Try string orderId (client-side Firestore orders)
      const q2 = query(
        collection(db, "orders"),
        where("orderId", "==", orderId)
      );

      const snap2 = await getDocs(q2);

      if (!snap2.empty) {
        const d = snap2.docs[0];
        setDocId(d.id);
        return d.id;
      }

      // Last resort: Try using orderId as document ID directly
      return orderId;
    } catch (err) {
      console.error("Doc lookup failed:", err);
      // Return orderId as potential document ID
      return orderId;
    }
  };

  // ⭐ Load order details
  const loadOrder = async () => {
    try {
      let id = docId;

      if (!id) {
        id = await findFirestoreDoc();
        if (!id) {
          setOrder(null);
          setLoading(false);
          return;
        }
      }

      const ref = doc(db, "orders", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setOrder(null);
        setLoading(false);
        return;
      }

      const data = snap.data();
      setOrder(data);

      // 🔔 Play status sound
      if (data.status !== lastStatus) {
        setLastStatus(data.status);
        const audio = document.getElementById("statusSound");
        audio?.play().catch(() => { });
      }

      // ETA
      if (data.createdAt?.toDate) {
        const start = data.createdAt.toDate().getTime();
        const now = Date.now();
        const diff = Math.floor((now - start) / 60000);
        setEtaMinutes(Math.max(45 - diff, 0));
      }

    } catch (err) {
      console.error("Tracking error:", err);
      setOrder(null);
    }

    setLoading(false);
  };

  // Auto refresh
  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId, docId]);

  // clear cart when delivered
  useEffect(() => {
    if (order?.status === "Delivered") clearCart();
  }, [order?.status]);

  // UI Rendering
  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: 50 }}>Loading order...</h3>;
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

  // Calculate current step index based on order status
  const currentIndex = steps.findIndex((s) => s === order.status);

  // Debug logging
  console.log("Order Status:", order.status);
  console.log("Current Index:", currentIndex);
  console.log("Steps:", steps);

  // If status doesn't match any step, default to first step (Order Placed)
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="tracking-container">
      <audio id="statusSound" src="/order_update.mp3" preload="auto"></audio>

      <h2 className="tracking-title">🚚 Live Order Tracking</h2>

      <p><b>Order ID:</b> {orderId}</p>
      <p><b>Total:</b> ₹{order.total || order.totalPrice}</p>
      <p><b>Current Status:</b> {order.status}</p>

      {etaMinutes !== null && order.status !== "Delivered" && (
        <p className="eta-time">⏳ Arriving in approx <b>{etaMinutes} min</b></p>
      )}

      <p className="tracking-address">📍 <b>Address:</b> {order.address}</p>

      {order.status === "Out for Delivery" && (order.boyName || order.boyPhone) && (
        <p>🛵 <b>Delivery Partner:</b> {order.boyName} ({order.boyPhone})</p>
      )}

      <div className="steps-wrapper">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${index <= activeIndex ? "step-active" : ""}`}
          >
            <div className="step-circle">{index + 1}</div>
            <p className="step-label">{step}</p>
          </div>
        ))}
      </div>

      {order.status === "Delivered" && (
        <button onClick={() => navigate("/")} className="reorder-btn">
          🔁 Re-Order
        </button>
      )}
    </div>
  );
}
