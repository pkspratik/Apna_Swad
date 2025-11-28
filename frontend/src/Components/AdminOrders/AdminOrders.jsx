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
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ⭐ LOAD USERS
  const loadUsers = () => {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      let map = {};
      snapshot.forEach((d) => (map[d.id] = d.data()));
      setUsers(map);
    });
  };

  // ⭐ LOAD ORDERS
  const loadOrders = () => {
    return onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      list.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setOrders(list);
      setLoading(false);
    });
  };

  // ⭐ MAIN LISTENERS
  useEffect(() => {
    const unsubUsers = loadUsers();
    const unsubOrders = loadOrders();
    return () => {
      unsubUsers();
      unsubOrders();
    };
  }, []);

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading Orders...</h3>;

  // ⭐ SEARCH ENGINE
  const filteredOrders = orders.filter((o) => {
    const k = search.toLowerCase();
    const u = users[o.userId] || {};
    return (
      String(o.orderId || "").includes(k) ||
      (u.name || "").toLowerCase().includes(k) ||
      (u.mobile || "").toLowerCase().includes(k) ||
      (o.address || "").toLowerCase().includes(k) ||
      (u.address || "").toLowerCase().includes(k) ||
      (o.paymentMethod || "").toLowerCase().includes(k) ||
      o.items?.some((i) => i.name.toLowerCase().includes(k))
    );
  });

  // ⭐ UPDATE STATUS
  const updateStatus = async (id, value) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: value } : o))
    );
    await updateDoc(doc(db, "orders", id), { status: value });
  };

  const updateBoyName = async (id, value) => {
    setOrders((p) =>
      p.map((o) => (o.id === id ? { ...o, boyName: value } : o))
    );
    await updateDoc(doc(db, "orders", id), { boyName: value });
  };

  const updateBoyPhone = async (id, value) => {
    setOrders((p) =>
      p.map((o) => (o.id === id ? { ...o, boyPhone: value } : o))
    );
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
          {filteredOrders.map((o, index) => {
            // ⭐ SAME MERGE LOGIC AS ADMIN DASHBOARD
            const user = users[o.userId] || {};
            const userName = user.name || "Unknown";
            const userMobile = user.mobile || "Not Available";
            const userAddress = user.address || "Not Provided";

            return (
              <tr key={o.id}>
                <td>{index + 1}</td>
                <td>{o.orderId || o.id}</td>
                <td>{userName}</td>
                <td>{userMobile}</td>
                <td>₹{o.total || o.totalPrice || 0}</td>

                <td>
                  <span
                    style={{
                      padding: "5px 7px",
                      background:
                        o.paymentMethod?.toLowerCase() === "cod"
                          ? "#007bff"
                          : "green",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    {o.paymentMethod?.toUpperCase()}
                  </span>
                </td>

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

                <td>
                  <ul>
                    {o.items?.map((i, idx) => (
                      <li key={idx}>
                        {i.name} × {i.qty}
                      </li>
                    ))}
                  </ul>
                </td>

                <td>
                  <b>Delivery Address:</b> {o.address || "Not Provided"} <br />
                  <br />
                  <b>Customer Address:</b>
                  <p>{userAddress}</p>

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
                    placeholder="Delivery Boy Phone"
                    value={o.boyPhone || ""}
                    onChange={(e) => updateBoyPhone(o.id, e.target.value)}
                    style={{ marginTop: 6 }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
