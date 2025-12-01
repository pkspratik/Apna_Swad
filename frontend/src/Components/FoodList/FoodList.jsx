
// import React, { useEffect, useState } from "react";
// import { Popup } from "../Popup/Popup";
// import { NevBar } from "../Heder_Nev/NevBar";
// import { Footer } from "../Footer/Footer";
// import { useCart } from "../../context/CartContext";
// import "./FoodList.css";

// export function FoodList({ category }) {

//   const [items, setItems] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const { cart, addToCart, increaseQty, decreaseQty, removeItem } = useCart();

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch("https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc");
//       const data = await res.json();
//       const cat = data.record.categories.find((c) => c.category === category);
//       setItems(cat?.products || []);
//     }
//     fetchData();
//   }, [category]);

//   return (
//     <div className="list-view-container">

//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       <h2 className="section-title">🍽️ {category}</h2>

//       {items.map((item) => (
//         <div className="list-card" key={item.id}>
//           <div className="left-section">
//             <h3>{item.name}</h3>
//             <p>{item.price}</p>
//           </div>

//           <div className="right-section">
//             <img src={item.img} alt={item.name} className="item-image" />
//             <button className="add-btn" onClick={() => {
//               setSelectedItem(item);
//               setShowPopup(true);
//             }}>
//               ADD
//             </button>
//           </div>
//         </div>
//       ))}

//       {showPopup && (
//         <Popup
//           item={selectedItem}
//           onClose={() => setShowPopup(false)}
//           addToCart={addToCart}
//         />
//       )}

//       {/* CART POPUP CAN BE GLOBAL (OPTIONAL) */}

//       <Footer />
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

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc");
      const data = await res.json();
      const cat = data.record.categories.find((c) => c.category === category);
      setItems(cat?.products || []);
    }
    fetchData();
  }, [category]);

  // 🔥 CONDITION-BASED POPUP HANDLER
  const handleAddClick = (item) => {
    if (category.toLowerCase() === "lunch") {
      // Show popup ONLY for lunch category
      setSelectedItem(item);
      setShowPopup(true);
    } else {
      // Directly add to cart for all other categories
      addToCart(item);
    }
  };

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

            {/* NEW CONDITION BASED ADD BUTTON */}
            <button className="add-btn" onClick={() => handleAddClick(item)}>
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

      <Footer />
    </div>
  );
}
