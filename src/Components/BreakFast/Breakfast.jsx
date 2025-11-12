import React, { useRef } from "react";
import "./Breakfast.css";

const restaurants = [
  {
    name: "Puri Sabzi",
    img: "https://png.pngtree.com/png-vector/20250416/ourmid/pngtree-delicious-indian-chole-bhature-platter-spicy-chickpea-curry-puri-bread-png-image_16032378.png",
    offer: "ITEMS AT ₹40",
    rating: "4.3",
    time: "25-30 mins",
    category: "Pizzas, Pastas, Italian, Desserts",
    location: "Patliputra Colony",
  },
  {
    name: "Chole Bhature",
    img: "https://static.vecteezy.com/system/resources/previews/057/733/355/non_2x/chole-bhature-isolated-on-transparent-background-png.png",
    offer: "ITEMS AT ₹50",
    rating: "4.0",
    time: "25-30 mins",
    category: "Pizzas, Snacks",
    location: "Lodipur",
  },
  {
    name: "Masala Dosa",
    img: "https://i.pinimg.com/736x/e9/61/c8/e961c86ba7e92618c20a6dca4e235758.jpg",
    offer: "40% OFF UPTO ₹70",
    rating: "4.5",
    time: "20-25 mins",
    category: "Desserts, Ice Cream",
    location: "Srikrishnapuri",
  },
  {
    name: "Litti Chokha",
    img: "https://w7.pngwing.com/pngs/977/183/png-transparent-litti-chokha.png",
    offer: "ITEMS AT ₹50",
    rating: "4.2",
    time: "30-35 mins",
    category: "Beverages, Cafe",
    location: "Patliputra Colony",
  },
];

export function Breakfast() {
  const scrollRef = useRef();

  const scroll = (dir) => {
    if (dir === "left") scrollRef.current.scrollLeft -= 300;
    else scrollRef.current.scrollLeft += 300;
  };

  return (
    <div className="top-restaurants">
      <div className="header">
        <h2>🍽️ Breakfast — What’s Your Choice?</h2>
        <div className="nav-btns">
          <button onClick={() => scroll("left")} className="scroll-btn">◀</button>
          <button onClick={() => scroll("right")} className="scroll-btn">▶</button>
        </div>
      </div>

      <div className="restaurant-list" ref={scrollRef}>
        {restaurants.map((res, i) => (
          <div className="restaurant-card" key={i}>
            <div className="image-container">
              <img src={res.img} alt={res.name} />
              <span className="offer">{res.offer}</span>
            </div>
            <div className="restaurant-info">
              <h4>{res.name}</h4>
              <p className="rating">⭐ {res.rating} • {res.time}</p>
              <p className="category">{res.category}</p>
              <p className="location">{res.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
