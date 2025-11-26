import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("userOrders") || "{}");
    const key = user?.email || user?.phone || user?.uid;
    setOrders(allOrders[key] || []);
  }, [user]);

  if (!orders.length)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>No orders yet.</h3>;

  const reorder = (items) => {
    items.forEach((item) => addToCart({ ...item, qty: item.qty || 1 }));
    navigate("/cart");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      case "Out for Delivery":
        return "orange";
      case "Preparing Food":
        return "#007bff";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 18 }}>📦 My Orders</h2>

      {orders.map((o) => (
        <div
          key={o.orderId}
          style={{
            marginBottom: 18,
            padding: 15,
            borderRadius: 10,
            border: "1px solid #ddd",
            boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
          }}
        >
          <p><b>Order ID:</b> {o.orderId}</p>
          <p><b>Time:</b> {o.createdAt ? new Date(o.createdAt).toLocaleString() : o.time}</p>

          {/* items list */}
          <div style={{ marginTop: 6 }}>
            <b>Items:</b>
            <ul style={{ paddingLeft: 18, marginTop: 5 }}>
              {Array.isArray(o.items) &&
                o.items.map((item, i) => (
                  <li key={i}>{item.name} x {item.qty}</li>
                ))}
            </ul>
          </div>

          <p><b>Total:</b> ₹{o.total}</p>

          {/* Payment tag */}
          <p>
            <b>Payment:</b>{" "}
            <span
              style={{
                background: o.paymentMethod === "upi" ? "green" : "#007bff",
                padding: "3px 8px",
                color: "white",
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              {o.paymentMethod?.toUpperCase()}
            </span>
          </p>

          {/* Status tag */}
          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                background: getStatusColor(o.status),
                padding: "3px 8px",
                color: "white",
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              {o.status}
            </span>
          </p>

          {o.address && <p><b>Address:</b> {o.address}</p>}

          {/* Action Buttons */}
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button
              onClick={() => navigate(`/order-tracking/${o.orderId}`)}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "none",
                background: "#ff6b00",
                color: "white",
                cursor: "pointer",
              }}
            >
              🔍 Track Order
            </button>

            <button
              onClick={() => reorder(o.items)}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "none",
                background: "#007bff",
                color: "white",
                cursor: "pointer",
              }}
            >
              🔁 Re-order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
