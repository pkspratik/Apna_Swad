import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ProductCategoryList.css";


export default function ProductCatogryDetails() {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState(null);

  const API_URL = "https://api.jsonbin.io/v3/b/6917cd0843b1c97be9ae24fc";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        const selected = json.record.categories.find(
          (cat) =>
            cat.category.toLowerCase() === categoryName.toLowerCase()
        );
        setCategoryData(selected);
      })
      .catch((err) => console.log(err));
  }, [categoryName]);

  if (!categoryData) return <h2 className="loader">Loading...</h2>;

  return (
    <div className="product-container">
      <h2 className="product-title">{categoryData.title}</h2>

      <div className="product-grid">
        {categoryData.products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-img-box">
              <img src={product.img} alt={product.name} />
              <span className="offer-tag">{product.offerText}</span>
            </div>

            <h3>{product.name}</h3>
            <p className="rating">⭐ {product.rating}</p>
            <p>{product.time}</p>
            <p className="price">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
