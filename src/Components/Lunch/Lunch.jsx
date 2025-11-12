import React, { useRef } from "react";
import "./Lunch.css";

const restaurants = [
  {
    name: "Pure Veg",
    img: "https://png.pngtree.com/png-clipart/20250116/original/pngtree-deluxe-indian-cuisine-thali-with-curries-png-image_20237450.png",
    offer: "ITEMS AT ₹150",
    rating: "4.3",
    time: "25-30 mins",
    category: "Pizzas, Pastas, Italian, Desserts",
    location: "Patliputra Colony",
  },
  {
    name: "Non-Veg",
    img: "https://p7.hiclipart.com/preview/746/20/950/vegetarian-cuisine-indian-cuisine-malai-asian-cuisine-kofta-non-veg-food.jpg",
    offer: "ITEMS AT ₹150",
    rating: "4.0",
    time: "25-30 mins",
    category: "Pizzas, Snacks",
    location: "Lodipur",
  },
  {
    name: "Biryani",
    img: "https://i.pinimg.com/736x/ce/99/19/ce9919d8c596f8d0d68c14ac5bb3693d.jpg",
    offer: "40% OFF UPTO ₹99",
    rating: "4.5",
    time: "20-25 mins",
    category: "Desserts, Ice Cream",
    location: "Srikrishnapuri",
  },
  {
    name: "Veg - Biryani",
    img: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-vegetable-biryani-on-plate-png-image_19293237.png",
    offer: "ITEMS AT ₹99",
    rating: "4.2",
    time: "30-35 mins",
    category: "Beverages, Cafe",
    location: "Patliputra Colony",
  },
];

export function Lunch() {
  const scrollRef = useRef();

  const scroll = (dir) => {
    if (dir === "left") scrollRef.current.scrollLeft -= 300;
    else scrollRef.current.scrollLeft += 300;
  };

  return (
    <div className="top-restaurants">
      <div className="header">
        <h4>Lunch & Dinner Please choose </h4>
        <div className="nav-btns">
          <button onClick={() => scroll("left")}>◀</button>
          <button onClick={() => scroll("right")}>▶</button>
        </div>
      </div>

      <div className="restaurant-list" ref={scrollRef}>
        {restaurants.map((res, i) => (
          <div className="restaurant-card" key={i}>
            <div className="image-container">
              <img src={res.img} alt={res.name} />
              <div className="offer">{res.offer}</div>
            </div>
            <div className="restaurant-info">
              <h5>{res.name}</h5>
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
