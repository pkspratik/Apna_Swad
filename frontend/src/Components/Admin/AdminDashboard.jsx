import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthContext";

export function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Sort newest first
        list.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setOrders(list);
      },
      (err) => {
        console.error("🔥 Error fetching orders:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔴 Logout handler
  const handleLogout = async () => {
    await logout();
    navigate("/admin-auth", { replace: true });
  };

  // 🗑 Delete single order
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order permanently?")) return;

    try {
      await deleteDoc(doc(db, "orders", id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Error deleting order. Check Firestore rules.");
    }
  };

  // Select multiple orders
  const handleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected orders
  const deleteSelected = async () => {
    if (!selectedOrders.length)
      return alert("No orders selected");

    if (!window.confirm(`Delete ${selectedOrders.length} orders?`))
      return;

    try {
      for (const id of selectedOrders) {
        await deleteDoc(doc(db, "orders", id));
      }
      setSelectedOrders([]);
    } catch (err) {
      console.error("Error deleting selected orders:", err);
      alert("Error deleting orders. Check Firestore rules.");
    }
  };

  // 📊 Stats
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const pending = totalOrders - delivered;
  const earnings = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-title">
        <h2>📊 Admin Dashboard</h2>

        <div className="top-buttons">
          <button
            className="orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            📦 View Orders
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🔐 Logout
          </button>
        </div>
      </div>

      {/* Stats Area */}
      <div className="stats-bar">
        <span>🛒 <b>Total Orders:</b> {totalOrders}</span>
        <span>⏳ <b>Pending:</b> {pending}</span>
        <span>🟢 <b>Delivered:</b> {delivered}</span>
        <span>💰 <b>Earnings:</b> ₹{earnings}</span>
      </div>

      <button className="delete-selected-btn" onClick={deleteSelected}>
        🗑 Delete Selected Orders
      </button>

      {/* Orders Table */}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Pay Method</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, i) => (
            <tr
              key={o.id}
              className={
                i === 0
                  ? "latest-order-row"
                  : o.status === "Delivered"
                    ? "delivered-row"
                    : "pending-row"
              }
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(o.id)}
                  onChange={() => handleSelect(o.id)}
                />
              </td>

              <td>{o.orderId || o.id}</td>

              <td>{o.address?.split(",")[0] || "Unknown"}</td>

              <td>
                {o.items?.length
                  ? o.items.map((i) => `${i.name} x ${i.qty}`).join(", ")
                  : "No items"}
              </td>

              <td>₹{o.total || 0}</td>

              <td>{o.paymentMethod?.toUpperCase() || "N/A"}</td>

              <td>
                <span
                  className={`status-badge ${(o.status || "Pending").replace(/ /g, "-")
                    }`}
                >
                  {o.status || "Pending"}
                </span>
              </td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(o.id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
