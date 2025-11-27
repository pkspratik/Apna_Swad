import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
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

  // 🔥 Load users + Orders
  useEffect(() => {
    const load = async () => {
      // load users
      const snap = await getDocs(collection(db, "users"));
      let userData = {};
      snap.forEach((u) => (userData[u.id] = u.data()));
      setUsers(userData);

      // listen to orders
      const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const o = d.data();
          const info = userData[o.userId] || {};

          return {
            id: d.id,
            ...o,

            // merge fields safely
            userName: o.userName || info.name || "Unknown",
            userMobile: o.userMobile || info.mobile || "N/A",
            userAddress: o.userAddress || info.address || "Not Provided",
          };
        });

        // sort by latest
        list.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setOrders(list);
      });

      return unsub;
    };

    const unsubPromise = load();

    return () => {
      unsubPromise.then((fn) => fn && fn());
    };
  }, []);

  // Remove duplicate orderId
  const uniqueOrders = Array.from(
    new Map(orders.map((o) => [o.orderId, o])).values()
  );

  // Search filter
  const filteredOrders = uniqueOrders.filter((o) => {
    const k = search.toLowerCase();
    return (
      String(o.orderId).includes(k) ||
      o.userName.toLowerCase().includes(k) ||
      o.userMobile.toLowerCase().includes(k) ||
      (o.address || "").toLowerCase().includes(k) ||
      (o.userAddress || "").toLowerCase().includes(k)
    );
  });

  // update status
  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "orders", id), { status: newStatus });
  };

  // update Delivery Boy
  const updateBoyName = async (id, v) => {
    await updateDoc(doc(db, "orders", id), { boyName: v });
  };
  const updateBoyPhone = async (id, v) => {
    await updateDoc(doc(db, "orders", id), { boyPhone: v });
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

              <td>
                <span className="payment-badge">
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

              <td style={{ maxWidth: 250 }}>
                <b>Delivery Address:</b>
                <p>{o.address || "Not Provided"}</p>

                <b>Customer Address:</b>
                <p>{o.userAddress}</p>

                <input
                  type="text"
                  className="delivery-input"
                  placeholder="Delivery Boy Name"
                  value={o.boyName || ""}
                  onChange={(e) => updateBoyName(o.id, e.target.value)}
                />

                <input
                  type="tel"
                  className="delivery-input"
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
