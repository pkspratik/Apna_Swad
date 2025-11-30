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
  const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

  // Restaurant coordinates
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
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // KM
  };

  const formatDistance = (distance) => {
    if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
    return `${distance.toFixed(2)} KM`;
  };

  // Detect Instagram in-app browser
  const isInstagramBrowser = () => navigator.userAgent.includes("Instagram");

  // Main Delivery Check Function
  const handleCheckDelivery = async () => {
    if (!user) {
      alert("Please login first to check delivery availability");
      navigate("/login?redirect=cart");
      return;
    }

    if (isInstagramBrowser()) {
      alert("Location is blocked inside Instagram browser. Please open in Chrome.");
      return;
    }

    setChecking(true);
    setDeliveryCheckedOnce(true);

    // Check geolocation permission (Android fix)
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: "geolocation" });

        if (permission.state === "denied") {
          alert("Please enable location from Chrome → Site Settings → Location → Allow");
          setChecking(false);
          return;
        }
      }
    } catch (e) {
      console.log("Permission API not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
        setUserDistance(distance);

        if (distance <= 60) setDeliveryAvailable(true);
        else setDeliveryAvailable(false);

        setUser({ ...user, lat, lng });

        setChecking(false);
      },
      async (error) => {
        console.log("GPS ERROR:", error);

        // Fallback to IP Location
        const fallback = await fetch("https://ipapi.co/json/")
          .then((r) => r.json())
          .catch(() => null);

        if (fallback && fallback.latitude) {
          const distance = getDistance(
            fallback.latitude,
            fallback.longitude,
            restaurantLat,
            restaurantLng
          );

          setUserDistance(distance);
          setDeliveryAvailable(distance <= 60);

          setUser({ ...user, lat: fallback.latitude, lng: fallback.longitude });

          alert("GPS unavailable, used approximate location.");
          setChecking(false);
          return;
        }

        alert("Location request timed out. Turn ON GPS & try again.");
        setChecking(false);
      },
      {
        enableHighAccuracy: false,  // Faster & stable on Android
        timeout: 8000,              // Faster timeout
        maximumAge: 20000,          // Allows cached fix → prevents timeout
      }
    );
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Please login before checkout");
      navigate("/login?redirect=summary");
      return;
    }

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

      {/* Delivery Check Button */}
      <button
        className="checkout-btn"
        onClick={handleCheckDelivery}
        disabled={checking || deliveryCheckedOnce}
        style={{
          opacity: deliveryCheckedOnce ? 0.6 : 1,
          cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
        }}
      >
        {checking
          ? "Checking..."
          : deliveryCheckedOnce
            ? "Delivery Checked ✔"
            : "Check food delivery availability"}
      </button>

      {/* Delivery Status */}
      {deliveryAvailable === true && (
        <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
          ✔ Food delivery is available in your area 🎉
          <br />📍 Distance: {formatDistance(userDistance)}
        </p>
      )}

      {deliveryAvailable === false && (
        <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
          ❌ Delivery not available (Only within 60 KM)
          <br />📍 Distance: {formatDistance(userDistance)}
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

                <button
                  className="remove-item"
                  onClick={() => removeItem(index)}
                >
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
