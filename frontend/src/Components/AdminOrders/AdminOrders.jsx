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

  // ⭐ REAL-TIME USERS LISTENER
  const loadUsers = () => {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      let map = {};
      snapshot.forEach((d) => (map[d.id] = d.data()));
      setUsers(map);
      console.log(`✅ Loaded ${snapshot.docs.length} users`);
    });
  };

  // ⭐ REAL-TIME ORDERS LISTENER
  const loadOrders = () => {
    return onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const order = d.data();
        // Users will be mapped via state, no need to pass userMap
        return {
          id: d.id,
          ...order,
        };
      });

      // ⭐ FIX SORTING CRASH
      list.sort((a, b) => {
        const t1 = a.createdAt?.seconds || 0;
        const t2 = b.createdAt?.seconds || 0;
        return t2 - t1;
      });

      setOrders(list);
      setLoading(false);
    });
  };

  // ⭐ MAIN LOADER
  useEffect(() => {
    let unsubscribeUsers = null;
    let unsubscribeOrders = null;

    const initAll = async () => {
      // Start both listeners
      unsubscribeUsers = loadUsers();

      // Safari FIX — load second call after micro-delay
      setTimeout(() => {
        unsubscribeOrders = loadOrders();
      }, 10);
    };

    initAll();

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>Loading Orders...</h3>;
  }

  // ⭐ SEARCH - Updated to handle dynamic user mapping
  const filteredOrders = orders.filter((o) => {
    const k = search.toLowerCase();
    const userInfo = users[o.userId] || {};
    const userName = userInfo.name || "";
    const userMobile = userInfo.mobile || "";

    return (
      String(o.orderId).includes(k) ||
      userName.toLowerCase().includes(k) ||
      userMobile.toLowerCase().includes(k) ||
      (o.address || "").toLowerCase().includes(k) ||
      (userInfo.address || "").toLowerCase().includes(k) ||
      (o.paymentMethod || "").toLowerCase().includes(k) ||
      o.items?.some((i) => i.name.toLowerCase().includes(k))
    );
  });

  // ⭐ UPDATE STATUS - With Optimistic UI
  const updateStatus = async (id, value) => {
    // Optimistic update - immediately update UI
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status: value } : order
      )
    );

    try {
      await updateDoc(doc(db, "orders", id), { status: value });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
      // Revert on error - reload from server
      loadOrders();
    }
  };

  const updateBoyName = async (id, val) => {
    // Optimistic update
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, boyName: val } : order
      )
    );

    try {
      await updateDoc(doc(db, "orders", id), { boyName: val });
    } catch (err) {
      console.error("Failed to update delivery boy name:", err);
    }
  };

  const updateBoyPhone = async (id, val) => {
    // Optimistic update
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, boyPhone: val } : order
      )
    );

    try {
      await updateDoc(doc(db, "orders", id), { boyPhone: val });
    } catch (err) {
      console.error("Failed to update delivery boy phone:", err);
    }
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
            // ⭐ DYNAMIC USER MAPPING
            const userInfo = users[o.userId] || {};
            const userName = userInfo.name || "Unknown";
            const userMobile = userInfo.mobile || "N/A";
            const userAddress = userInfo.address || "Not Provided";

            return (
              <tr key={o.id}>
                <td>{index + 1}</td>
                <td>{o.orderId}</td>
                <td>{userName}</td>
                <td>{userMobile}</td>

                {/* ⭐ FIX total crash */}
                <td>₹{o.total || o.totalPrice}</td>

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
                  <b>Delivery Address:</b> <br />
                  {o.address || "Not Provided"} <br /><br />

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
                    placeholder="Phone"
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
