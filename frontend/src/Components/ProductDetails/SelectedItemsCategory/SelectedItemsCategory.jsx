import React from "react";
import { useLocation } from "react-router-dom";



export function SelectedItemsCategory() {
  const { state } = useLocation(); // category data

  if (!state) return <h2>No category data found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{state.title}</h1>

      <div className="category-products">
        {state.products.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>⭐ {item.rating} • {item.time}</p>
            <p>{item.cuisines.join(", ")}</p>
            <p>{item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
