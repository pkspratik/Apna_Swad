import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const statusOptions = [
  "Order Placed",
  "Accepted by Restaurant",
  "Preparing Food",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 Real-time Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Sort newest first
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(list);
    });
    return () => unsub();
  }, []);

  // 🚫 REMOVE DUPLICATE ORDERS by orderId
  const uniqueOrders = Array.from(
    new Map(orders.map((o) => [o.orderId, o])).values()
  );

  // 🔥 Today Summary
  const today = new Date().toLocaleDateString();
  const todayOrders = uniqueOrders.filter((o) => {
    const date = o.createdAt?.seconds
      ? new Date(o.createdAt.seconds * 1000).toLocaleDateString()
      : "";
    return date === today;
  });

  const totalToday = todayOrders.length;
  const pendingToday = todayOrders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;
  const deliveredToday = todayOrders.filter((o) => o.status === "Delivered").length;
  const earningsToday = todayOrders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // 🔍 Search Filter
  const filteredOrders = uniqueOrders.filter((o) => {
    const k = search.toLowerCase();
    return (
      String(o.orderId).includes(k) ||
      (o.address || "").toLowerCase().includes(k) ||
      (o.paymentMethod || "").toLowerCase().includes(k) ||
      o.items?.some((i) => i.name.toLowerCase().includes(k)) ||
      (o.boyPhone || "").includes(k)
    );
  });

  // 🔥 Update Status
  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  };

  return (
    <div className="admin-orders-container">
      <h2>Admin – Orders Dashboard</h2>

      {/* 🔥 Today Summary */}
      <div className="stats-container">
        <div className="stat-box">Total Orders: {totalToday}</div>
        <div className="stat-box">Pending: {pendingToday}</div>
        <div className="stat-box">Delivered: {deliveredToday}</div>
        <div className="stat-box">Earnings: ₹{earningsToday}</div>
      </div>

      {/* 🔍 Search box */}
      <input
        type="text"
        className="order-search"
        placeholder="Search Order ID / Name / Status / Phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="orders-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Items</th>
            <th>Address / Delivery Boy</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o, index) => (
            <tr key={o.id}>
              <td>{index + 1}</td>
              <td>{o.orderId}</td>
              <td>₹{o.total}</td>

              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    color: "white",
                    background:
                      o.paymentMethod === "cod"
                        ? "#007bff"
                        : o.paymentMethod === "upi"
                        ? "green"
                        : "gray",
                  }}
                >
                  {o.paymentMethod?.toUpperCase()}
                </span>
              </td>

              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>

              <td style={{ maxWidth: 200 }}>
                <ul style={{ margin: 0 }}>
                  {o.items?.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.qty}
                    </li>
                  ))}
                </ul>
              </td>

              <td style={{ maxWidth: 260 }}>
                <p style={{ whiteSpace: "pre-line", marginBottom: 6 }}>
                  {o.address || "Address Not Provided"}
                </p>
                <input
                  className="delivery-input"
                  type="text"
                  placeholder="Delivery Boy Name"
                  value={o.boyName || ""}
                  onChange={(e) => updateDoc(doc(db, "orders", o.id), { boyName: e.target.value })}
                />
                <input
                  className="delivery-input"
                  type="tel"
                  placeholder="Phone"
                  style={{ marginTop: 6 }}
                  value={o.boyPhone || ""}
                  onChange={(e) => updateDoc(doc(db, "orders", o.id), { boyPhone: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
