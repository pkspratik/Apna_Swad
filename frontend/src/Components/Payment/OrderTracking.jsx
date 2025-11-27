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

  // 🔥 Fix: Find correct Firestore document by order.orderId
  const findOrderDoc = async () => {
    const q = query(collection(db, "orders"), where("orderId", "==", orderId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const d = snap.docs[0];
      setDocId(d.id);
      return d.id;
    }

    return null;
  };

  // Load order details
  const loadOrder = async () => {
    try {
      let id = docId;

      // If docId is unknown, find it first
      if (!id) {
        id = await findOrderDoc();
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

      // Play sound on status change
      if (data.status !== lastStatus) {
        setLastStatus(data.status);
        document.getElementById("statusSound")?.play().catch(() => { });
      }

      // ETA calculation
      if (data.createdAt?.toDate) {
        const start = data.createdAt.toDate().getTime();
        const now = Date.now();
        const diffMin = Math.floor((now - start) / 60000);
        setEtaMinutes(Math.max(45 - diffMin, 0));
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setOrder(null);
    }

    setLoading(false);
  };

  // Auto reload every 4 seconds
  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId, docId]);

  // Clear cart when delivered
  useEffect(() => {
    if (order?.status === "Delivered") {
      clearCart();
    }
  }, [order?.status]);

  // UI
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
        <button onClick={() => navigate("/")} className="reorder-btn">
          🔁 Re-Order
        </button>
      )}
    </div>
  );
}
