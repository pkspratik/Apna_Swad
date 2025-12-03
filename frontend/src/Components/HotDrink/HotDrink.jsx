import React, { useState, useEffect } from "react";
import "./HotDrink.css";

export function HotDrink() {

  const allDrinks = [
    // Tea
    { name: "Masala Tea", category: "tea", price: 15, image: "/images/masala-tea.png" },
    { name: "Ginger Tea", category: "tea", price: 20, image: "/images/ginger-tea.png" },
    { name: "Lemon Tea", category: "tea", price: 25, image: "/images/lemon-tea.png" },
    { name: "Green Tea", category: "tea", price: 30, image: "/images/green-tea.png" },

    // Coffee
    { name: "Hot Coffee", category: "coffee", price: 30, image: "/images/hot-coffee.png" },
    { name: "Cold Coffee", category: "coffee", price: 40, image: "/images/cold-coffee.png" },
    { name: "Cappuccino", category: "coffee", price: 60, image: "/images/cappuccino.png" },
    { name: "Latte", category: "coffee", price: 70, image: "/images/latte.png" }
  ];

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [list, setList] = useState(allDrinks);

  useEffect(() => {
    let filtered = allDrinks;

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
    <div className="hotdrink-container">

      {/* Search Bar */}
      <input
        type="text"
        className="search-box"
        placeholder="Search Tea or Coffee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "tea" ? "active tea" : "tea"}
          onClick={() => setFilter("tea")}
        >
          Tea
        </button>

        <button
          className={filter === "coffee" ? "active coffee" : "coffee"}
          onClick={() => setFilter("coffee")}
        >
          Coffee
        </button>
      </div>

      {/* Drink List */}
      <div className="hotdrink-grid">
        {list.map((item, index) => (
          <div className="hotdrink-card" key={index}>
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
