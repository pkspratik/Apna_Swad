import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../../API_Data/products.json";
import "./ProductDetailsPage.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const allCategories = data.categories;

  // 1️⃣ Find category containing this product
  const categoryGroup = allCategories.find((cat) =>
    cat.products.some((p) => p.id.toString() === id.toString())
  );

  if (!categoryGroup) {
    return <p style={{ textAlign: "center" }}>Category not found.</p>;
  }

  // 2️⃣ Find product inside the matched category
  const product = categoryGroup.products.find(
    (p) => p.id.toString() === id.toString()
  );

  if (!product) {
    return <p style={{ textAlign: "center" }}>Product not found.</p>;
  }

  return (
    <div className="details-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Product Main Card */}
      <div className="product-main-card">
        <img src={product.img} alt={product.name} className="details-img" />

        <div className="details-content">
          <h1>{product.name}</h1>
          <p className="details-rating">⭐ {product.rating}</p>
          <p className="details-desc">{product.time}</p>
          <p className="details-price">Price: <strong>{product.price}</strong></p>
          <button className="details-add-btn">Add to Cart</button>
        </div>
      </div>

      {/* Suggestion List */}
      <h2 className="section-heading">
        More in {categoryGroup.title}
      </h2>

      <div className="suggestion-list">
        {categoryGroup.products
          .filter((p) => p.id !== product.id)
          .map((item) => (
            <div
              key={item.id}
              className="suggestion-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.img} alt={item.name} className="suggestion-img" />
              <h4>{item.name}</h4>
              <p>⭐ {item.rating}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
