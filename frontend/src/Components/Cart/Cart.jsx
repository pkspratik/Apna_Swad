import React, { useState } from "react";
import "./Cart.css";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";

export function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [userDistance, setUserDistance] = useState(null);

  // 🔥 Restaurant coordinates
  const restaurantLat = 26.033207;
  const restaurantLng = 84.835460;

  const toRad = (value) => (value * Math.PI) / 180;

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // KM
  };

  const formatDistance = (distance) => {
    if (distance * 1000 < 1000) {
      return `${(distance * 1000).toFixed(0)} meters`;
    }
    return `${distance.toFixed(2)} KM`;
  };

  // 🔥 Login Required for Delivery Check
  const handleCheckDelivery = () => {
    if (!user) {
      alert("Please login first to check delivery availability");
      navigate("/login?redirect=cart");
      return;
    }

    setChecking(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
        setUserDistance(distance);

        // Distance check (3 KM)
        if (distance <= 3) {
          setDeliveryAvailable(true);
        } else {
          // Temporary allow for testing — your choice
          setDeliveryAvailable(true);
        }

        // Save location inside Auth user object
        setUser({ ...user, lat, lng });

        setChecking(false);
      },
      () => {
        alert("Unable to detect location");
        setChecking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // 🔥 Checkout requires Login
  const handleCheckout = () => {
    if (!user) {
      alert("Please login before checkout");
      navigate("/login?redirect=summary");
      return;
    }

    // Also check delivery status
    if (deliveryAvailable !== true) {
      alert("Please check delivery availability first");
      return;
    }

    navigate("/summary");
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = Number(item.price.replace("₹", ""));
    return sum + price * item.qty;
  }, 0);

  return (
    <div className="cart-wrapper">
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="cart-header">
        <h2>Your Cart</h2>
      </div>

      {/* Delivery Check */}
      <button
        className="checkout-btn"
        onClick={handleCheckDelivery}
        disabled={checking}
      >
        {checking ? "Checking..." : "Check food delivery availability"}
      </button>

      {deliveryAvailable === true && (
        <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
          ✔ Food delivery is available in your area 🎉
          <br />
          📍 Distance: {formatDistance(userDistance)}
        </p>
      )}

      {deliveryAvailable === false && (
        <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
          ❌ Sorry, you are outside the 3 KM delivery range
          <br />
          📍 Distance: {formatDistance(userDistance)}
        </p>
      )}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" />
          <h3>Your cart is empty</h3>
          <p>Add something tasty!</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.img} alt="" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-option">{item.option}</p>
                  <p className="item-price">₹{item.price.replace("₹", "")}</p>

                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(index)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(index)}>+</button>
                  </div>
                </div>

                <button className="remove-item" onClick={() => removeItem(index)}>
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="total-row">
              <p>Total Amount</p>
              <h3>₹{totalAmount}</h3>
            </div>

            {deliveryAvailable === true && (
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
