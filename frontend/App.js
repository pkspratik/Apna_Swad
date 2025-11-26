import { Routes, Route } from "react-router-dom";
import ProductDetails from "../ProductDetails/ProductDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product-details" element={<ProductDetails />} />
    </Routes>
  );
}

export default App;
