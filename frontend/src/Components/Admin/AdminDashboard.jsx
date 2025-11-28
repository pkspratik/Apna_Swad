// import React, { useEffect, useState } from "react";
// import "./AdminDashboard.css";
// import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext/AuthContext";

// export function AdminDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState({});
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   // ⭐ REAL-TIME USERS LISTENER
//   const loadUsers = () => {
//     return onSnapshot(
//       collection(db, "users"),
//       (snapshot) => {
//         let map = {};
//         snapshot.forEach((d) => (map[d.id] = d.data()));
//         setUsers(map);
//         console.log(`✅ Loaded ${snapshot.docs.length} users`);
//       },
//       (error) => {
//         console.error("❌ Error loading users:", error);
//       }
//     );
//   };

//   // ⭐ FETCH ORDERS + MERGE USER DATA - Real-time
//   useEffect(() => {
//     let unsubscribeUsers = null;
//     let unsubscribeOrders = null;

//     const initAll = async () => {
//       // Start users listener first
//       unsubscribeUsers = loadUsers();

//       // Start orders listener after a micro-delay (Safari fix)
//       setTimeout(() => {
//         unsubscribeOrders = onSnapshot(
//           collection(db, "orders"),
//           (snapshot) => {
//             const list = snapshot.docs.map((d) => {
//               const data = d.data();
//               const userData = users[data.userId] || {};

//               return {
//                 id: d.id,
//                 ...data,
//                 userName: userData.name || "Unknown",
//                 userMobile: userData.mobile || "Not Available",
//                 userAddress: userData.address || "No Address Provided",
//               };
//             });

//             list.sort(
//               (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
//             );

//             setOrders(list);
//           },
//           (err) => {
//             console.error("🔥 Error fetching orders:", err);
//             alert("Error fetching orders: " + err.message);
//           }
//         );
//       }, 10);
//     };

//     initAll();

//     return () => {
//       if (unsubscribeUsers) unsubscribeUsers();
//       if (unsubscribeOrders) unsubscribeOrders();
//     };
//   }, [users]); // Reload when users update

//   // 🔴 Logout handler
//   const handleLogout = async () => {
//     await logout();
//     navigate("/admin-auth", { replace: true });
//   };

//   // 🗑 Delete single order
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this order permanently?")) return;

//     try {
//       await deleteDoc(doc(db, "orders", id));
//     } catch (err) {
//       console.error("Failed to delete order:", err);
//       alert("Error deleting order. Check Firestore rules.");
//     }
//   };

//   // Select multiple orders
//   const handleSelect = (id) => {
//     setSelectedOrders((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   // Delete selected orders
//   const deleteSelected = async () => {
//     if (!selectedOrders.length) return alert("No orders selected");

//     if (!window.confirm(`Delete ${selectedOrders.length} orders?`)) return;

//     try {
//       for (const id of selectedOrders) {
//         await deleteDoc(doc(db, "orders", id));
//       }
//       setSelectedOrders([]);
//     } catch (err) {
//       console.error("Error deleting selected orders:", err);
//       alert("Error deleting orders. Check Firestore rules.");
//     }
//   };

//   // 📊 Stats
//   const totalOrders = orders.length;
//   const delivered = orders.filter((o) => o.status === "Delivered").length;
//   const pending = totalOrders - delivered;
//   const earnings = orders
//     .filter((o) => o.status === "Delivered")
//     .reduce((sum, o) => sum + Number(o.total || 0), 0);

//   return (
//     <div className="admin-dashboard">
//       <div className="dashboard-title">
//         <h2>📊 Admin Dashboard</h2>

//         <div className="top-buttons">
//           <button className="orders-btn" onClick={() => navigate("/admin/orders")}>
//             📦 View Orders
//           </button>

//           <button className="logout-btn" onClick={handleLogout}>
//             🔐 Logout
//           </button>
//         </div>
//       </div>

//       {/* Stats Area */}
//       <div className="stats-bar">
//         <span>🛒 <b>Total Orders:</b> {totalOrders}</span>
//         <span>⏳ <b>Pending:</b> {pending}</span>
//         <span>🟢 <b>Delivered:</b> {delivered}</span>
//         <span>💰 <b>Earnings:</b> ₹{earnings}</span>
//       </div>

//       <button className="delete-selected-btn" onClick={deleteSelected}>
//         🗑 Delete Selected Orders
//       </button>

//       {/* Orders Table */}
//       <table className="dashboard-table">
//         <thead>
//           <tr>
//             <th>Select</th>
//             <th>Order ID</th>
//             <th>Customer Name</th>
//             <th>Mobile</th>
//             <th>Delivery Address</th>
//             <th>Items</th>
//             <th>Total</th>
//             <th>Pay Method</th>
//             <th>Status</th>
//             <th>Delete</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.map((o, i) => (
//             <tr
//               key={o.id}
//               className={
//                 i === 0
//                   ? "latest-order-row"
//                   : o.status === "Delivered"
//                     ? "delivered-row"
//                     : "pending-row"
//               }
//             >
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={selectedOrders.includes(o.id)}
//                   onChange={() => handleSelect(o.id)}
//                 />
//               </td>

//               <td>{o.orderId || o.id}</td>

//               {/* ⭐ New Fields */}
//               <td>{o.userName}</td>

//               <td>{o.userMobile}</td>

//               <td>{o.address || o.userAddress}</td>

//               <td>
//                 {o.items?.length
//                   ? o.items.map((i) => `${i.name} x ${i.qty}`).join(", ")
//                   : "No items"}
//               </td>

//               <td>₹{o.total || 0}</td>

//               <td>{o.paymentMethod?.toUpperCase() || "N/A"}</td>

//               <td>
//                 <span
//                   className={`status-badge ${(o.status || "Pending").replace(/ /g, "-")}`}
//                 >
//                   {o.status || "Pending"}
//                 </span>
//               </td>

//               <td>
//                 <button className="delete-btn" onClick={() => handleDelete(o.id)}>
//                   ❌
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthContext";

export function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load users
  const loadUsers = () => {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      let map = {};
      snapshot.forEach((d) => (map[d.id] = d.data()));
      setUsers(map);
    });
  };

  // Load orders and merge user data
  const loadOrders = () => {
    return onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        const user = users[data.userId] || {};
        return {
          id: d.id,
          ...data,
          userName: user.name || "Unknown",
          userMobile: user.mobile || "Not Available",
          userAddress: user.address || "Not Provided",
        };
      });

      list.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setOrders(list);
    });
  };

  // Main listeners
  useEffect(() => {
    const u1 = loadUsers();
    const u2 = setTimeout(() => loadOrders(), 30);
    return () => {
      u1();
      clearTimeout(u2);
    };
  }, [users]);

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/admin-auth", { replace: true });
  };

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await deleteDoc(doc(db, "orders", id));
  };

  const handleSelect = (id) => {
    setSelectedOrders((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const deleteSelected = async () => {
    if (!selectedOrders.length) return alert("Select orders first");
    if (!window.confirm(`Delete ${selectedOrders.length} orders?`)) return;
    for (const id of selectedOrders) await deleteDoc(doc(db, "orders", id));
    setSelectedOrders([]);
  };

  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const pending = total - delivered;
  const earnings = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-title">
        <h2>📊 Admin Dashboard</h2>

        <div className="top-buttons">
          <button className="orders-btn" onClick={() => navigate("/admin/orders")}>
            📦 View Orders
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🔐 Logout
          </button>
        </div>
      </div>

      <div className="stats-bar">
        <span>🛒 <b>Total Orders:</b> {total}</span>
        <span>⏳ <b>Pending:</b> {pending}</span>
        <span>🟢 <b>Delivered:</b> {delivered}</span>
        <span>💰 <b>Earnings:</b> ₹{earnings}</span>
      </div>

      <button className="delete-selected-btn" onClick={deleteSelected}>
        🗑 Delete Selected Orders
      </button>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Delivery Address</th>
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
              <td>{o.userName}</td>
              <td>{o.userMobile}</td>
              <td>{o.address || o.userAddress}</td>

              <td>
                {o.items?.length
                  ? o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")
                  : "No items"}
              </td>

              <td>₹{o.total || 0}</td>

              <td>{o.paymentMethod?.toUpperCase() || "N/A"}</td>

              <td>
                <span className={`status-badge ${(o.status || "").replace(/ /g, "-")}`}>
                  {o.status || "Pending"}
                </span>
              </td>

              <td>
                <button className="delete-btn" onClick={() => handleDelete(o.id)}>
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

