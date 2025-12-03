
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
              Add to Cart
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

//   const { addToCart } = useCart();

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch("https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc");
//       const data = await res.json();
//       const cat = data.record.categories.find((c) => c.category === category);
//       setItems(cat?.products || []);
//     }
//     fetchData();
//   }, [category]);

//   // Popup only for lunch
//   const handleAddClick = (item) => {
//     if (category.toLowerCase() === "lunch") {
//       setSelectedItem(item);
//       setShowPopup(true);
//     } else {
//       addToCart(item);
//     }
//   };

//   return (
//     <div className="foodlist-container">

//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       <h2 className="foodlist-title">🍽️ {category}</h2>

//       {/* GRID LIST VIEW */}
//       <div className="food-grid">
//         {items.map((item) => (
//           <div className="food-card" key={item.id}>

//             <img src={item.img} alt={item.name} className="food-image" />

//             <p className="food-name">{item.name}</p>
//             <p className="food-price">₹{item.price}</p>

//             <button className="add-btn" onClick={() => handleAddClick(item)}>
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>

//       {showPopup && (
//         <Popup
//           item={selectedItem}
//           onClose={() => setShowPopup(false)}
//           addToCart={addToCart}
//         />
//       )}

//       <Footer />

//     </div>
//   );
// }
