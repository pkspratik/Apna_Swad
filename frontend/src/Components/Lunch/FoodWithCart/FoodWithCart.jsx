// FoodWithCart.jsx
import React, { useState, useMemo } from "react";

export function FoodWithCart({ addToCart }){
  // Sample items (you can replace with API data later)
  const items = [
    {
      id: 1,
      name: "Zafrani Veg Biryani (Serve 1)",
      halfPrice: 99,
      fullPrice: 179,
      description:
        "Fragrant vegetable biryani cooked with saffron, mixed fresh vegetables & basmati rice.",
      img: "https://png.pngtree.com/png-vector/20240903/ourmid/pngtree-biryani-rice-plate-top-view-png-image_2158757.png",
    },
    {
      id: 2,
      name: "Kolkata Chicken Dum Biryani (Serve 1)",
      halfPrice: 109,
      fullPrice: 199,
      description: "Slow-cooked Kolkata-style chicken biryani with spices and saffron.",
      img: "https://png.pngtree.com/png-vector/20231027/ourmid/pngtree-kolkata-style-biryani-png-image_13431642.png",
    },
  ];

  // popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); // "half" | "full"

  // cart state
  const [cart, setCart] = useState([]);

  // Open popup for item
  const openPopup = (item) => {
    setSelectedItem(item);
    setSelectedSize(""); // reset
    setShowPopup(true);
  };

  // Calculate price for selected size
  const selectedPrice = useMemo(() => {
    if (!selectedItem || !selectedSize) return 0;
    return selectedSize === "half" ? selectedItem.halfPrice : selectedItem.fullPrice;
  }, [selectedItem, selectedSize]);

  // Add to cart logic
  // const handleAddToLocalCart = () =>{
  //   if (!selectedSize) {
  //     alert("Please select Half or Full.");
  //     return;
  //   }
  //   // Cart item unique key: itemId + size
  //   const key = `${selectedItem.id}_${selectedSize}`;
  //   setCart((prev) => {
  //     const existingIndex = prev.findIndex((c) => c.key === key);
  //     if (existingIndex > -1) {
  //       // increase qty
  //       const copy = [...prev];
  //       copy[existingIndex].qty += 1;
  //       return copy;
  //     } else {
  //       // new entry
  //       return [
  //         ...prev,
  //         {
  //           key,
  //           id: selectedItem.id,
  //           name: selectedItem.name,
  //           size: selectedSize,
  //           price: selectedPrice,
  //           qty: 1,
  //           img: selectedItem.img,
  //         },
  //       ];
  //     }
  //   });

  //   setShowPopup(false);
  // };            

  {/*New code*/}

  const handleAddToLocalCart = () => {
  if (!selectedSize) {
    alert("Please select Half or Full.");
    return;
  }

  const cartItem = {
    id: selectedItem.id,
    name: selectedItem.name,
    size: selectedSize,
    price: selectedSize === "half" ? selectedItem.halfPrice : selectedItem.fullPrice,
    img: selectedItem.img,
    qty: 1,
  };

  addToCart(cartItem); // 👍 now using App.jsx function

  setShowPopup(false);
};

  


  // Increase quantity
  const incQty = (key) => {
    setCart((prev) => prev.map((c) => (c.key === key ? { ...c, qty: c.qty + 1 } : c)));
  };

  // Decrease quantity (remove when qty = 0)
  const decQty = (key) => {
    setCart((prev) =>
      prev
        .map((c) => (c.key === key ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    );
  };

  // Remove item
  const removeItem = (key) => {
    setCart((prev) => prev.filter((c) => c.key !== key));
  };

  // Totals
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.qty * c.price, 0);

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: 12 }}>Menu</h1>

      <div style={styles.menu}>
        {items.map((it) => (
          <div key={it.id} style={styles.card}>
            <div style={{ display: "flex", gap: 12 }}>
              <img src={it.img} alt="" style={styles.img} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 6px" }}>{it.name}</h3>
                <p style={{ margin: "0 0 8px", color: "#555" }}>{it.description}</p>
                <div style={{ color: "#111", fontWeight: 600 }}>
                  From ₹{it.halfPrice} • Full ₹{it.fullPrice}
                </div>
              </div>
            </div>

            <div style={{ alignSelf: "center" }}>
              {/* <button style={styles.addBtn} onClick={() => openPopup(it)}>
                ADD
              </button> */}

               <button style={styles.confirmBtn} onClick={handleAddToLocalCart}>
             Add to Cart
               </button>

            </div>
          </div>
        ))}
      </div>

      {/* Cart summary sticky bottom */}
      <div style={styles.cartBar}>
        <div>
          <div style={{ fontWeight: 700 }}>{totalItems} item(s)</div>
          <div style={{ fontSize: 14, color: "#fffddf" }}>₹ {totalPrice.toFixed(2)}</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={styles.viewCartBtn}
            onClick={() => {
              // Scroll to cart section or toggle a cart panel — here we just open alert
              const summary = cart
                .map((c) => `${c.name} (${c.size}) x${c.qty} = ₹${c.qty * c.price}`)
                .join("\n");
              if (!cart.length) {
                alert("Cart is empty");
              } else {
                alert("Cart:\n\n" + summary + `\n\nTotal: ₹${totalPrice.toFixed(2)}`);
              }
            }}
          >
            VIEW CART
          </button>
        </div>
      </div>

      {/* Cart Drawer (simple inline list above bottom bar) */}
      <div style={styles.cartList}>
        <h3 style={{ margin: "8px 0" }}>Cart</h3>
        {cart.length === 0 && <div style={{ color: "#666" }}>Your cart is empty</div>}

        {cart.map((c) => (
          <div key={c.key} style={styles.cartItem}>
            <img src={c.img} alt="" style={{ width: 60, height: 60, borderRadius: 8 }} />
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "#555" }}>{c.size.toUpperCase()}</div>
              <div style={{ marginTop: 6 }}>₹{c.price} x {c.qty} = ₹{c.price * c.qty}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <button onClick={() => incQty(c.key)} style={styles.qtyBtn}>+</button>
              <div>{c.qty}</div>
              <button onClick={() => decQty(c.key)} style={styles.qtyBtn}>-</button>
              <button onClick={() => removeItem(c.key)} style={styles.removeBtn}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for half/full selection */}
      {showPopup && selectedItem && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3 style={{ margin: 0 }}>{selectedItem.name}</h3>
            <p style={{ color: "#555", marginTop: 6 }}>{selectedItem.description}</p>

            <div style={{ marginTop: 12 }}>
              <label style={styles.optionRow}>
                <input
                  type="radio"
                  name="size"
                  value="half"
                  checked={selectedSize === "half"}
                  onChange={() => setSelectedSize("half")}
                />
                <span style={{ marginLeft: 8 }}>Half — ₹{selectedItem.halfPrice}</span>
              </label>

              <label style={{ ...styles.optionRow, marginTop: 8 }}>
                <input
                  type="radio"
                  name="size"
                  value="full"
                  checked={selectedSize === "full"}
                  onChange={() => setSelectedSize("full")}
                />
                <span style={{ marginLeft: 8 }}>Full — ₹{selectedItem.fullPrice}</span>
              </label>
            </div>

            <div style={{ marginTop: 12, fontWeight: 700 }}>
              Final: ₹{selectedSize ? (selectedSize === "half" ? selectedItem.halfPrice : selectedItem.fullPrice) : "0"}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={styles.confirmBtn} onClick={addToCart}>
                Add to Cart
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- styles ---
const styles = {
  container: { padding: 18, fontFamily: "Inter, Roboto, system-ui, sans-serif" },
  menu: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 92 },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #eee",
    padding: 12,
    borderRadius: 10,
    gap: 16,
  },
  img: { width: 120, height: 90, objectFit: "cover", borderRadius: 8 },
  addBtn: {
    background: "#0a8f48",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },

  cartBar: {
    position: "fixed",
    left: 16,
    right: 16,
    bottom: 16,
    background: "#0a8f48",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 40,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  viewCartBtn: {
    background: "#fff",
    color: "#0a8f48",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },

  cartList: {
    marginTop: 18,
    borderTop: "1px dashed #eee",
    paddingTop: 12,
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderBottom: "1px solid #f3f3f3",
  },
  qtyBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "#fff",
  },
  removeBtn: {
    marginTop: 8,
    background: "#fff0f0",
    color: "#c33",
    border: "1px solid #f2caca",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
  },

  // popup
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  popup: {
    background: "#fff",
    width: 360,
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    background: "#0a8f48",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },
  cancelBtn: {
    flex: 1,
    background: "#f1f1f1",
    border: "none",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
    color: "#333",
  },
};
