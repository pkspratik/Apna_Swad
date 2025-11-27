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
  const [loading, setLoading] = useState(true);

  // 🔥 Load USERS first (Safari important!)
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    let map = {};
    snap.forEach((d) => (map[d.id] = d.data()));
    setUsers(map);
    return map;
  };

  // 🔥 Real-time Orders Listener
  const loadOrders = (userMap) => {
    return onSnapshot(collection(db, "orders"), (snapshot) => {

      const list = snapshot.docs.map((d) => {
        const order = d.data();
        const userInfo = userMap[order.userId] || {};

        return {
          id: d.id,
          ...order,
          userName: userInfo.name || "Unknown",
          userMobile: userInfo.mobile || "N/A",
          userAddress: userInfo.address || "Not Provided",
        };
      });

      // Sort newest first
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setOrders(list);
      setLoading(false);
    });
  };

  // 🔥 Main Loader
  useEffect(() => {
    let unsubscribe = null;

    const init = async () => {
      const userMap = await loadUsers();
      unsubscribe = loadOrders(userMap);
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>Loading Orders...</h3>;
  }

  // 🔍 Search filter
  const filteredOrders = orders.filter((o) => {
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

  // 🔥 Update Status
  const updateStatus = async (id, value) => {
    await updateDoc(doc(db, "orders", id), { status: value });
  };

  // 🔥 Update Delivery Boy Name
  const updateBoyName = async (id, value) => {
    await updateDoc(doc(db, "orders", id), { boyName: value });
  };

  // 🔥 Update Delivery Boy Phone
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
              <td>{o.orderId}</td>
              <td>{o.userName}</td>
              <td>{o.userMobile}</td>
              <td>₹{o.total}</td>

              {/* Payment Color Fix */}
              <td>
                <span
                  style={{
                    padding: "5px 8px",
                    borderRadius: "6px",
                    color: "#fff",
                    background:
                      o.paymentMethod?.toLowerCase() === "cod"
                        ? "#007bff"
                        : "green",
                  }}
                >
                  {o.paymentMethod?.toUpperCase()}
                </span>
              </td>

              {/* Status */}
              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>

              {/* Items */}
              <td>
                <ul>
                  {o.items?.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.qty}
                    </li>
                  ))}
                </ul>
              </td>

              {/* Delivery Info */}
              <td>
                <b>Delivery Address:</b> <br />
                {o.address || "Not Provided"} <br />
                <br />

                <b>Customer Address:</b>
                <p>{o.userAddress}</p>

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
                  style={{ marginTop: 6 }}
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
