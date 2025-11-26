import React, { useState } from "react";
import { Popup } from "./Popup";

export default function Menu() {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Add item to cart and update qty if already exists
  const addToCart = (newItem) => {
    setCart((prev) => {
      const exists = prev.find(
        (i) => i.id === newItem.id && i.option === newItem.option
      );

      // If exists → update quantity
      if (exists) {
        return prev.map((i) =>
          i.id === newItem.id && i.option === newItem.option
            ? { ...i, qty: i.qty + newItem.qty }
            : i
        );
      }

      // Else → add new item
      return [...prev, newItem];
    });
  };

  const items = [
    {
      id: 1,
      name: "Chicken Biryani",
      img: "/biryani.jpg",
      desc: "Delicious spicy biryani"
    },
    {
      id: 2,
      name: "Paneer Tikka",
      img: "/paneer.jpg",
      desc: "Smoky grilled paneer"
    },
  ];

  return (
    <div>

      <h1>Menu</h1>

      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <button onClick={() => setSelectedItem(item)}>View</button>
        </div>
      ))}

      {/* Popup */}
      {selectedItem && (
        <Popup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          addToCart={addToCart}
        />
      )}

      {/* Cart Display */}
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>No items yet...</p>}

      {cart.map((c, i) => (
        <div key={i}>
          {c.name} - {c.option} - Qty: {c.qty}
        </div>
      ))}
    </div>
  );
}
