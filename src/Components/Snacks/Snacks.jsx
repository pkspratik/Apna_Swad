import React, { useRef } from "react";
import "./Snacks.css";

const restaurants = [
  {
    name: "Pizza",
    img: "https://www.freeiconspng.com/uploads/pizza-png-1.png",
    offer: "ITEMS AT ₹89",
    rating: "4.3",
    time: "25-30 mins",
    category: "Pizzas, Pastas, Italian, Desserts",
    location: "Patliputra Colony",
  },
  {
    name: "Cold & Hot Drink",
    img: "https://png.pngtree.com/png-vector/20241213/ourlarge/pngtree-snacks-png-image_14743131.png",
    offer: "ITEMS AT ₹119",
    rating: "4.0",
    time: "25-30 mins",
    category: "Pizzas, Snacks",
    location: "Lodipur",
  },
  {
    name: "Burger",
    img: "https://png.pngtree.com/png-vector/20250121/ourlarge/pngtree-burger-isolated-transparent-background-png-image_15296529.png",
    offer: "40% OFF UPTO ₹80",
    rating: "4.5",
    time: "20-25 mins",
    category: "Desserts, Ice Cream",
    location: "Srikrishnapuri",
  },
  {
    name: "Pani Puri",
    img: "https://png.pngtree.com/png-vector/20250126/ourmid/pngtree-indian-street-food-pani-puri-golgappa-round-hd-image-png-image_15337745.png",
    offer: "ITEMS AT ₹30",
    rating: "4.2",
    time: "30-35 mins",
    category: "Beverages, Cafe",
    location: "Patliputra Colony",
  },
];

export function Snacks() {
  const scrollRef = useRef();

  const scroll = (dir) => {
    if (dir === "left") scrollRef.current.scrollLeft -= 300;
    else scrollRef.current.scrollLeft += 300;
  };

  return (
    <div className="top-restaurants">
      <div className="header">
        <h4>Snacks Please choose </h4>
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
