import React from "react";
import data from "../../../API_Data/products.json";
import { Link } from "react-router-dom";
import "./CategoryPage.css";

export default function CategoryPage() {
  const categories = data.record?.categories ?? data.categories ?? [];

  return (
    <div className="category-container">
      {categories.map((cat) => (
        <div key={cat.category} className="category-block">
          <h2 className="category-title">{cat.title}</h2>

          <div className="product-grid">
            {cat.products.map((item) => (
              <Link
                to={`/pro/${item.id}`}
                className="product-card"
                key={item.id}
              >
                <img src={item.img} alt={item.name} className="product-img" />
                <h3 className="product-name">{item.name}</h3>

                <div className="product-info">
                  <span>⭐ {item.rating}</span>
                  <span>{item.price}</span>
                </div>

                <p className="product-offer">{item.offerText}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
