import { useParams } from "react-router-dom";
import apiData from "../path/to/api.json";

export default function ProductDetails() {
  const { categoryName, productId } = useParams();

  // Find category
  const categoryObj = apiData.categories.find(
    (c) => c.category === categoryName
  );

  if (!categoryObj) return <h2>Category not found</h2>;

  // Find product
  const product = categoryObj.products.find(
    (p) => p.id === Number(productId)
  );

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img src={product.img} alt={product.name} width="250" />

      <p><strong>Rating:</strong> {product.rating}</p>
      <p><strong>Time:</strong> {product.time}</p>
      <p><strong>Price:</strong> {product.price}</p>
      <p><strong>Location:</strong> {product.location}</p>
      <p><strong>Category:</strong> {categoryName}</p>
    </div>
  );
}
