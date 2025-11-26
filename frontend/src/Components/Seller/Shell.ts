import React from "react";
import { Link } from "react-router-dom";

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <div className="font-bold">ApnaSwad Admin</div>
        <div className="flex gap-4">
          <Link to="/admin">Admin</Link>
          <Link to="/seller">Seller</Link>
          <Link to="/">Home</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto mt-6">{children}</main>
    </div>
  );
}
