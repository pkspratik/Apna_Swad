// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(saved);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

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

//   const clearCart = () => {
//     setCart([]);                     // reset UI state
//     localStorage.removeItem("cart"); // remove storage
//   };

//   return (
//     <CartContext.Provider value={{
//       cart,
//       addToCart,
//       increaseQty,
//       decreaseQty,
//       removeItem,
//       clearCart
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => useContext(CartContext);


import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  // Save to storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ================================================
  // 🔥 SAFE addToCart — NEVER allows missing price/qty
  // ================================================
  const addToCart = (item) => {
    // Clean & normalize price
    let cleanPrice = item?.price ?? 0;

    cleanPrice = cleanPrice.toString().replace(/[^\d.]/g, "");
    cleanPrice = Number(cleanPrice);
    if (isNaN(cleanPrice)) cleanPrice = 0;

    const newItem = {
      id: item.id,
      name: item.name ?? "",
      img: item.img ?? "",
      option: item.option ?? "",
      price: cleanPrice,      // always a number
      qty: item.qty ? Number(item.qty) : 1, // always minimum 1
    };

    setCart((prev) => {
      const exists = prev.find(
        (i) => i.id === newItem.id && i.option === newItem.option
      );

      // If item already exists → increase quantity
      if (exists) {
        return prev.map((i) =>
          i.id === newItem.id && i.option === newItem.option
            ? { ...i, qty: i.qty + newItem.qty }
            : i
        );
      }

      // Otherwise add fresh item
      return [...prev, newItem];
    });
  };

  // Increase qty
  const increaseQty = (index) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease qty
  const decreaseQty = (index) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  // Remove single item
  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
