import React, { useState, useEffect } from "react";
import "./ColdDrink.css";

export function ColdDrink() {

  const allColdDrinks = [
    // Soft Drinks
    { name: "Coca Cola", category: "softdrink", price: 20, image: "/images/coca-cola.png" },
    { name: "Sprite", category: "softdrink", price: 20, image: "/images/sprite.png" },
    { name: "Fanta", category: "softdrink", price: 20, image: "/images/fanta.png" },

    // Juices
    { name: "Mango Juice", category: "juice", price: 40, image: "/images/mango-juice.png" },
    { name: "Orange Juice", category: "juice", price: 40, image: "/images/orange-juice.png" },
    { name: "Apple Juice", category: "juice", price: 45, image: "/images/apple-juice.png" },

    // Milkshakes
    { name: "Chocolate Shake", category: "milkshake", price: 60, image: "/images/choco-shake.png" },
    { name: "Strawberry Shake", category: "milkshake", price: 60, image: "/images/strawberry-shake.png" },
    { name: "Vanilla Shake", category: "milkshake", price: 55, image: "/images/vanilla-shake.png" },

    // Lassi
    { name: "Sweet Lassi", category: "lassi", price: 35, image: "/images/sweet-lassi.png" },
    { name: "Salted Lassi", category: "lassi", price: 35, image: "/images/salt-lassi.png" },

    // Coffee
    { name: "Cold Coffee", category: "coffee", price: 45, image: "/images/cold-coffee.png" },
  ];

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [list, setList] = useState(allColdDrinks);

  useEffect(() => {
    let filtered = allColdDrinks;

    if (filter !== "all") {
      filtered = filtered.filter(item => item.category === filter);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setList(filtered);
  }, [filter, search]);

  return (
    <div className="colddrink-container">

      {/* Search Bar */}
      <input
        type="text"
        className="search-box"
        placeholder="Search cold drinks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          All
        </button>

        <button className={filter === "softdrink" ? "active softdrink" : "softdrink"} onClick={() => setFilter("softdrink")}>
          Soft Drink
        </button>

        <button className={filter === "juice" ? "active juice" : "juice"} onClick={() => setFilter("juice")}>
          Juice
        </button>

        <button className={filter === "milkshake" ? "active shake" : "shake"} onClick={() => setFilter("milkshake")}>
          Shake
        </button>

        <button className={filter === "lassi" ? "active lassi" : "lassi"} onClick={() => setFilter("lassi")}>
          Lassi
        </button>

        <button className={filter === "coffee" ? "active coffee" : "coffee"} onClick={() => setFilter("coffee")}>
          Coffee
        </button>
      </div>

      {/* Items Grid */}
      <div className="colddrink-grid">
        {list.map((item, index) => (
          <div className="colddrink-card" key={index}>
            <img src={item.image} alt={item.name} />

            <p className="title">{item.name}</p>

            <p className="price">₹{item.price}</p>

            <button className="add-btn">Add to Cart</button>
          </div>
        ))}
      </div>

    </div>
  );
}
