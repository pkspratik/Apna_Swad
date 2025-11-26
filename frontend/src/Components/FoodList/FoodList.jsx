// import React, { useEffect, useState } from "react";
// import { Popup } from "../Popup/Popup";
// import "./FoodList.css";
// import { NevBar } from "../Heder_Nev/NevBar";
// import { Footer } from "../Footer/Footer";

// export function FoodList({ category }) {

//   const [items, setItems] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // CART
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);

//   // Fetch data by category
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc");
//         const data = await res.json();

//         const categories = data.record.categories;

//         const cat = categories.find((c) => c.category === category);

//         setItems(cat?.products || []);
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     }

//     fetchData();
//   }, [category]);

//   // Add to cart
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

//   // Cart functions
//   const increaseQty = (index) => {
//     setCart((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, qty: item.qty + 1 } : item
//       )
//     );
//   };

//   const decreaseQty = (index) => {
//     setCart((prev) =>
//       prev.map((item, i) =>
//         i === index && item.qty > 1
//           ? { ...item, qty: item.qty - 1 }
//           : item
//       )
//     );
//   };

//   const removeItem = (index) => {
//     setCart((prev) => prev.filter((_, i) => i !== index));
//   };

//   const openPopup = (item) => {
//     setSelectedItem(item);
//     setShowPopup(true);
//   };

//   return (
//     <div className="list-view-container">
      
//       {/* Nevbar */}

//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       <h2 className="section-title">🍽️ {category}</h2>

//       {items.length === 0 ? (
//         <p>Loading...</p>
//       ) : (
//         items.map((item) => (
//           <div className="list-card" key={item.id}>
//             <div className="left-section">
//               <h3>{item.name}</h3>
//               <p>{item.price}</p>
//             </div>

//             <div className="right-section">
//               <img src={item.img} alt={item.name} className="item-image" />
//               <button className="add-btn" onClick={() => openPopup(item)}>
//                 ADD
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Popup */}
//       {showPopup && (
//         <Popup
//           item={selectedItem}
//           onClose={() => setShowPopup(false)}
//           addToCart={addToCart}
//         />
//       )}

//       {/* Floating Cart */}
//       <div className="floating-cart" onClick={() => setShowCart(true)}>
//         🛒 <span className="cart-count">{cart.length}</span>
//       </div>

//       {/* Cart Modal */}
//       {showCart && (
//         <div className="cart-overlay">
//           <div className="cart-container">
//             <button className="cart-close-btn" onClick={() => setShowCart(false)}>
//               ✖
//             </button>

//             <h2>Your Cart</h2>

//             {cart.length === 0 ? (
//               <p>Cart is empty</p>
//             ) : (
//               cart.map((item, index) => (
//                 <div className="cart-item" key={index}>
//                   <img src={item.img} alt={item.name} className="cart-img" />

//                   <div className="cart-details">
//                     <h4>{item.name}</h4>
//                     <p>{item.option}</p>

//                     <div className="cart-qty">
//                       <button onClick={() => decreaseQty(index)}>-</button>
//                       <span>{item.qty}</span>
//                       <button onClick={() => increaseQty(index)}>+</button>
//                     </div>
//                   </div>

//                   <button className="remove-btn" onClick={() => removeItem(index)}>
//                     🗑️
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}

  

//       {/* End of Footer */}
//        <Footer />
     

//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { Popup } from "../Popup/Popup";
import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./FoodList.css";

export function FoodList({ category }) {

  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { cart, addToCart, increaseQty, decreaseQty, removeItem } = useCart();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc");
      const data = await res.json();
      const cat = data.record.categories.find((c) => c.category === category);
      setItems(cat?.products || []);
    }
    fetchData();
  }, [category]);

  return (
    <div className="list-view-container">

      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <h2 className="section-title">🍽️ {category}</h2>

      {items.map((item) => (
        <div className="list-card" key={item.id}>
          <div className="left-section">
            <h3>{item.name}</h3>
            <p>{item.price}</p>
          </div>

          <div className="right-section">
            <img src={item.img} alt={item.name} className="item-image" />
            <button className="add-btn" onClick={() => {
              setSelectedItem(item);
              setShowPopup(true);
            }}>
              ADD
            </button>
          </div>
        </div>
      ))}

      {showPopup && (
        <Popup
          item={selectedItem}
          onClose={() => setShowPopup(false)}
          addToCart={addToCart}
        />
      )}

      {/* CART POPUP CAN BE GLOBAL (OPTIONAL) */}

      <Footer />
    </div>
  );
}

