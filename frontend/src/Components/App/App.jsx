import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../Home/Home";
import { ProductDetails } from "../ProductDetails/ProductDetails";
import CategoryList from "../ProductDetails/ProductCategoryList/CategoryList";
import CategoryPage from "../ProductDetails/ProductCategoryList/CategoryPage";
import ProductCategoryList from "../ProductDetails/ProductCategoryList/ProductCategoryList";
import { ProductPage } from "../ProductDetails/ProductPage/ProductPage";
import { ItemDetails } from "../ProductDetails/ItemDetails/ItemDetails";
import { SelectedItemsCategory } from "../ProductDetails/SelectedItemsCategory/SelectedItemsCategory";
import { Breakfast } from "../BreakFast/Breakfast";
import { Lunch } from "../Lunch/Lunch";
import { Snacks } from "../Snacks/Snacks";
import { FoodWithCart } from "../Lunch/FoodWithCart/FoodWithCart";
import { Cart } from "../Cart/Cart";

// GLOBAL CART PROVIDER
import { CartProvider } from "../../context/CartContext";

// Login + Role Based Pages
import Login from "../Login/Login";
import SellerPage from "../Seller/SellerPage";
import BuyerPage from "../Buyer/BuyerPage";
import Signup from "../Login/Signup";
import ForgotPassword from "../Login/ForgotPassword";

import { RoleRoute } from "../../routes/RoleRoute";
import { Summary } from "../Summary/Summary";
import { Payment } from "../Payment/Payment";
import { UPIPayment } from "../Payment/UPIPayment";
import { OrderSuccess } from "../Payment/OrderSuccess";
import { OrderTracking } from "../Payment/OrderTracking";

// ADMIN PAGES
import { AdminDashboard } from "../Admin/AdminDashboard";
import { AdminOrders } from "../AdminOrders/AdminOrders";

import { ContactUs } from "../ContactUs/ContactUs";

export default function App() {
  return (
    <CartProvider>
      <Routes>

        {/* 🔓 PUBLIC LOGIN PAGE (customer) */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 ADMIN LOGIN PAGE */}
        <Route path="/admin-auth" element={<Login />} />

        {/* 🔒 ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* 🔒 ADMIN ORDERS PANEL */}
        <Route
          path="/admin/orders"
          element={
            <RoleRoute allowedRole="admin">
              <AdminOrders />
            </RoleRoute>
          }
        />

        {/* OPTIONAL ADMIN HOME */}
        <Route
          path="/admin/home"
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* 🔒 BUYER */}
        <Route
          path="/buyer"
          element={
            <RoleRoute allowedRole="buyer">
              <BuyerPage />
            </RoleRoute>
          }
        />

        {/* 🔒 SELLER */}
        <Route
          path="/seller"
          element={
            <RoleRoute allowedRole="seller">
              <SellerPage />
            </RoleRoute>
          }
        />

        {/* ===== OTHER USER ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<FoodWithCart />} />
        <Route path="/product/:id" element={<ItemDetails />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/category/page" element={<CategoryPage />} />
        <Route path="/category-list" element={<ProductCategoryList />} />
        <Route path="/product-page" element={<ProductPage />} />
        <Route path="/selected-items" element={<SelectedItemsCategory />} />
        <Route path="/category/Breakfast" element={<Breakfast />} />
        <Route path="/category/Lunch" element={<Lunch />} />
        <Route path="/category/Snacks" element={<Snacks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/upi-payment" element={<UPIPayment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />

      </Routes>
    </CartProvider>
  );
}
