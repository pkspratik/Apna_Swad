import React from "react";
import { Routes, Route } from "react-router-dom";

// MAIN SCREENS
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
import { Sweets } from "../Sweets/Sweets";
import { FoodWithCart } from "../Lunch/FoodWithCart/FoodWithCart";
import { Cart } from "../Cart/Cart";

// PROVIDERS
import { CartProvider } from "../../context/CartContext";

// AUTH SCREENS
import Login from "../Login/Login";
import Signup from "../Login/Signup";
import ForgotPassword from "../Login/ForgotPassword";

// ADMIN
import { AdminDashboard } from "../Admin/AdminDashboard";
import { AdminOrders } from "../AdminOrders/AdminOrders";

// ROLE ROUTE
import { RoleRoute } from "../../routes/RoleRoute";

// BUYER / SELLER (not used, but kept)
import SellerPage from "../Seller/SellerPage";
import BuyerPage from "../Buyer/BuyerPage";

// OTHERS
import { Summary } from "../Summary/Summary";
import { Payment } from "../Payment/Payment";
import { UPIPayment } from "../Payment/UPIPayment";
import { OrderSuccess } from "../Payment/OrderSuccess";
import { OrderTracking } from "../Payment/OrderTracking";
import { ContactUs } from "../ContactUs/ContactUs";
import { UserProfile } from "../UserProfile/UserProfile";

import { Debug } from "../../Pages/Debug/Debug";

export default function App() {
  return (
    <CartProvider>
      <Routes>

        {/* ===========================
           🔓 PUBLIC LOGIN ROUTES
        ============================ */}

        {/* Customer Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Login */}
        <Route path="/admin-auth" element={<Login />} />


        {/* ===========================
           🔐 PROTECTED ADMIN ROUTES
        ============================ */}

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* Admin Orders Page */}
        <Route
          path="/admin/orders"
          element={
            <RoleRoute allowedRole="admin">
              <AdminOrders />
            </RoleRoute>
          }
        />


        {/* ===========================
           OPTIONAL ADMIN HOME ROUTE
        ============================ */}
        <Route
          path="/admin/home"
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />


        {/* ===========================
           🔒 PROTECTED BUYER / SELLER
        ============================ */}

        <Route
          path="/buyer"
          element={
            <RoleRoute allowedRole="buyer">
              <BuyerPage />
            </RoleRoute>
          }
        />

        <Route
          path="/seller"
          element={
            <RoleRoute allowedRole="seller">
              <SellerPage />
            </RoleRoute>
          }
        />

        {/* ===========================
           🌐 Debug Routes
        ============================ */}


        <Route path="/debug" element={<Debug />} />


        {/* ===========================
           🌐 PUBLIC ROUTES
        ============================ */}

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
        <Route path="/category/Sweets" element={<Sweets />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/summary" element={<Summary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/upi-payment" element={<UPIPayment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/profile" element={<UserProfile />} />

      </Routes>
    </CartProvider>
  );
}
