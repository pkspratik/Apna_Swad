import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import { collection, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
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
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");

  // ⭐ Fetch user profiles (name, mobile, address)
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    let data = {};
    snap.forEach((u) => (data[u.id] = u.data()));
    setUsers(data); // { uid: {name, mobile, address...} }
  };

  // 🔥 Load Orders Real-Time
  useEffect(() => {
    loadUsers();

    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const order = d.data();
        const userInfo = users[order.userId] || {};

        return {
          id: d.id,
          ...order,

          // ⭐ New fields merged into order
          userName: userInfo.name || "Unknown",
          userMobile: userInfo.mobile || "N/A",
          userAddress: userInfo.address || "",
        };
      });

      // Sort latest first
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(list);
    });

    return () => unsub();
  }, [users]);

  // Remove duplicate orderIds
  const uniqueOrders = Array.from(new Map(orders.map((o) => [o.orderId, o])).values());

  // 🔥 Today's Summary
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

  // 🔍 Search filter improvements
  const filteredOrders = uniqueOrders.filter((o) => {
    const k = search.toLowerCase();
    return (
      String(o.orderId).includes(k) ||
      o.userName.toLowerCase().includes(k) ||
      o.userMobile.toLowerCase().includes(k) ||
      (o.address || "").toLowerCase().includes(k) ||
      (o.userAddress || "").toLowerCase().includes(k) ||
      (o.paymentMethod || "").toLowerCase().includes(k) ||
      o.items?.some((i) => i.name.toLowerCase().includes(k))
    );
  });

  // ⭐ Update Status
  const updateStatus = async (orderID, newStatus) => {
    await updateDoc(doc(db, "orders", orderID), { status: newStatus });
  };

  // ⭐ Update Delivery Boy Name
  const updateBoyName = async (orderID, value) => {
    await updateDoc(doc(db, "orders", orderID), { boyName: value });
  };

  // ⭐ Update Delivery Boy Phone
  const updateBoyPhone = async (orderID, value) => {
    await updateDoc(doc(db, "orders", orderID), { boyPhone: value });
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
        placeholder="Search Order ID / Name / Phone / Status"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="orders-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Items</th>
            <th>Delivery Details</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o, index) => (
            <tr key={o.id}>
              <td>{index + 1}</td>

              <td>{o.orderId}</td>

              {/* ⭐ Customer Name */}
              <td>{o.userName}</td>

              {/* ⭐ Customer Mobile */}
              <td>{o.userMobile}</td>

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

              {/* ⭐ Status Update Dropdown */}
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>

              {/* Items list */}
              <td style={{ maxWidth: 180 }}>
                <ul style={{ margin: 0 }}>
                  {o.items?.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.qty}
                    </li>
                  ))}
                </ul>
              </td>

              {/* ⭐ Delivery & Address */}
              <td style={{ maxWidth: 240 }}>
                <p style={{ whiteSpace: "pre-line", marginBottom: 6 }}>
                  <b>Delivery Address:</b><br />
                  {o.address || "Address not found"}
                </p>

                <b>Customer Address:</b>
                <p>{o.userAddress || "No registered address"}</p>

                <input
                  className="delivery-input"
                  type="text"
                  placeholder="Delivery Boy Name"
                  value={o.boyName || ""}
                  onChange={(e) => updateBoyName(o.id, e.target.value)}
                />

                <input
                  className="delivery-input"
                  type="tel"
                  placeholder="Phone"
                  style={{ marginTop: 6 }}
                  value={o.boyPhone || ""}
                  onChange={(e) => updateBoyPhone(o.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
