import React, { useState } from "react";
import "./Popup.css";

export function Popup({ item, onClose, addToCart }) {
  const [option, setOption] = useState(""); // half / full
  const [qty, setQty] = useState(1);

  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => qty > 1 && setQty(qty - 1);

  const handleAdd = () => {
    if (!option) {
      alert("Please select Half or Full");
      return;
    }

    addToCart({
      ...item,
      option,
      qty,
    });

    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">

        <button className="close-btn" onClick={onClose}>✖</button>

        <h2 className="popup-title">{item.name}</h2>
        <img src={item.img} alt={item.name} className="popup-img" />
        <p className="popup-desc">{item.desc}</p>

        <div className="options-section">
          <h4>Select Type:</h4>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={option === "Half"}
              onChange={() => setOption("Half")}
            />
            <span>Half</span>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={option === "Full"}
              onChange={() => setOption("Full")}
            />
            <span>Full</span>
          </label>
        </div>

        <div className="qty-box">
          <button className="qty-btn" onClick={decreaseQty}>-</button>
          <span className="qty-value">{qty}</span>
          <button className="qty-btn" onClick={increaseQty}>+</button>
        </div>

        <button className="add-cart-btn" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
