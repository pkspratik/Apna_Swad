// import React, { useState, useEffect } from "react";
// import "./Lunch.css";
// import { Popup } from "../Lunch/LunchPopup/Popup";

// export function Lunch() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // CART STATE
//   const [cart, setCart] = useState([]);

//   // ADD TO CART FUNCTION
//   const addToCart = (newItem) => {
//     setCart((prev) => {
//       const exists = prev.find(
//         (i) => i.id === newItem.id && i.option === newItem.option
//       );

//       if (exists) {
//         return prev.map((i) =>
//           i.id === newItem.id && i.option === newItem.option
//             ? { ...i, qty: i.qty + newItem.qty }
//             : i
//         );
//       }

//       return [...prev, newItem];
//     });
//   };
   
//   // Increase quantity from cart
// const increaseQty = (index) => {
//   setCart((prev) =>
//     prev.map((item, i) =>
//       i === index ? { ...item, qty: item.qty + 1 } : item
//     )
//   );
// };

// // Decrease quantity from cart
// const decreaseQty = (index) => {
//   setCart((prev) =>
//     prev.map((item, i) =>
//       i === index && item.qty > 1
//         ? { ...item, qty: item.qty - 1 }
//         : item
//     )
//   );
// };

// // Remove item
// const removeItem = (index) => {
//   setCart((prev) => prev.filter((_, i) => i !== index));
// };






//   useEffect(() => {
//     async function fetchLunch() {
//       try {
//         const res = await fetch("https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc");
//         const data = await res.json();

//         const categories = data.record.categories;

//         const lunchCategory = categories.find(
//           (cat) => cat.category === "Lunch"
//         );

//         setRestaurants(lunchCategory?.products || []);
//       } catch (error) {
//         console.error("Error fetching Lunch data:", error);
//       }
//     }

//     fetchLunch();
//   }, []);

//   const handleAddClick = (item) => {
//     setSelectedItem(item);
//     setShowPopup(true);
//   };

//   return (
//     <div className="list-view-container">
//       <h2 className="section-title">🍽️ Lunch & Dinner — Please choose</h2>

//       {restaurants.length === 0 ? (
//         <p>Loading...</p>
//       ) : (
//         restaurants.map((item) => (
//           <div className="list-card" key={item.id}>
//             <div className="left-section">
//               <h3 className="item-name">{item.name}</h3>

//               <p className="price">
//                 <span className="price-main">{item.price}</span>
//                 <span className="offer-text"> 💚 {item.offerText}</span>
//               </p>

//               <p className="description">{item.time}</p>

//               <hr className="divider" />
//             </div>

//             <div className="right-section">
//               <img src={item.img} alt={item.name} className="item-image" />

//               <button className="add-btn" onClick={() => handleAddClick(item)}>
//                 ADD
//               </button>

//               <p className="customizable">Customisable</p>
//             </div>
//           </div>
//         ))
//       )}

//       {showPopup && (
//         <Popup
//           item={selectedItem}
//           onClose={() => setShowPopup(false)}
//           addToCart={addToCart}   // ✅ FIXED
//         />
//       )}

//       {/* OPTIONAL CART VIEW */}
//       <h2>🛒 Your Cart</h2>
//       {cart.map((item, i) => (
//         <div key={i}>
//           {item.name} - {item.option} - Qty: {item.qty}
//         </div>
//       ))}
//     </div>
//   );
// }


import { FoodList } from "../FoodList/FoodList";

export function Lunch() {
  return <FoodList category="Lunch" />;
}
