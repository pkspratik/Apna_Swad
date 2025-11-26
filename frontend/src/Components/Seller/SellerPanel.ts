import React, { useState } from "react";

export default function SellerPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", stock: "", image: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd(e) {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || "https://via.placeholder.com/120",
    };
    setProducts([newProduct, ...products]);
    setForm({ title: "", price: "", stock: "", image: "" });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Panel</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow mb-6 space-y-3">
        <input name="title" className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="price" className="w-full border p-2 rounded" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="stock" className="w-full border p-2 rounded" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="image" className="w-full border p-2 rounded" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Add Product</button>
      </form>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Your Products</h2>
        {products.length === 0 && <p>No products added yet</p>}
        {products.map((p) => (
          <div key={p.id} className="p-3 border-b flex items-center gap-3">
            <img src={p.image} className="w-16 h-16 rounded" />
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-500">₹{p.price} — {p.stock} stock</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
