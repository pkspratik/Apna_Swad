import React from "react";
import { useParams } from "react-router-dom";
import getProductById from "../../../utils/getProductById";

export function ItemDetails() {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <img
        src={product.img}
        alt={product.name}
        style={{ width: "250px", borderRadius: "12px" }}
      />
      <p><b>Rating:</b> {product.rating}</p>
      <p><b>Price:</b> {product.price}</p>
      <p><b>Time:</b> {product.time}</p>
      <p><b>Offer:</b> {product.offerText}</p>

      <h3>Cuisines</h3>
      <ul>
        {product.cuisines.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
