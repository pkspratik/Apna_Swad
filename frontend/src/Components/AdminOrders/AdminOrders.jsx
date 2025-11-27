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
  const [usersLoaded, setUsersLoaded] = useState(false);

  // Load USERS first
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    let map = {};
    snap.forEach((u) => (map[u.id] = u.data()));
    setUsers(map);
    setUsersLoaded(true);
  };

  // Load Orders only after users loaded
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!usersLoaded) return;

    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        const user = users[data.userId] || {};

        return {
          id: d.id,
          ...data,
          userName: user.name || "Unknown",
          userMobile: user.mobile || "N/A",
          userAddress: user.address || "",
        };
      });

      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setOrders(list);
    });

    return () => unsub();
  }, [usersLoaded, users]);

  // UNIQUE Orders (avoid duplicate IDs)
  const uniqueOrders = Array.from(new Map(orders.map((o) => [(o.orderId || o.id), o])).values());

  // Search Filter
  const filteredOrders = uniqueOrders.filter((o) => {
    const k = search.toLowerCase();
    return (
      String(o.orderId).includes(k) ||
      String(o.id).includes(k) ||
      o.userName.toLowerCase().includes(k) ||
      o.userMobile.toLowerCase().includes(k) ||
      (o.address || "").toLowerCase().includes(k) ||
      (o.userAddress || "").toLowerCase().includes(k)
    );
  });

  // Update Status
  const updateStatus = async (id, value) => {
    await updateDoc(doc(db, "orders", id), { status: value });
  };

  // Update Delivery Boy Name
  const updateBoyName = async (id, value) => {
    await updateDoc(doc(db, "orders", id), { boyName: value });
  };

  // Update Delivery Boy Phone
  const updateBoyPhone = async (id, value) => {
    await updateDoc(doc(db, "orders", id), { boyPhone: value });
  };

  return (
    <div className="admin-orders-container">
      <h2>Admin – Orders Dashboard</h2>

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

              {/* FIXED ORDER ID */}
              <td>{o.orderId || o.id}</td>

              <td>{o.userName}</td>
              <td>{o.userMobile}</td>

              <td>₹{o.total || 0}</td>

              <td>{o.paymentMethod?.toUpperCase() || "N/A"}</td>

              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>

              <td>
                <ul>
                  {o.items?.map((i, idx) => (
                    <li key={idx}>{i.name} × {i.qty}</li>
                  ))}
                </ul>
              </td>

              <td>
                <b>Delivery Address:</b><br />
                {o.address || "Not Provided"}<br />

                <b>Customer Address:</b><br />
                {o.userAddress || "Not Provided"}<br />

                <input
                  className="delivery-input"
                  placeholder="Delivery Boy Name"
                  value={o.boyName || ""}
                  onChange={(e) => updateBoyName(o.id, e.target.value)}
                />

                <input
                  className="delivery-input"
                  style={{ marginTop: 6 }}
                  type="tel"
                  placeholder="Phone"
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
