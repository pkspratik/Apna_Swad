import React, { useState } from "react";
import "./Summary.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

import { NevBar } from "../Heder_Nev/NevBar.jsx";
import { Footer } from "../Footer/Footer.jsx";

export function Summary() {
  const { cart } = useCart();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [userDistance, setUserDistance] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  const restaurantLat = 26.033197;
  const restaurantLng = 84.835471;

  const toRad = (value) => (value * Math.PI) / 180;
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const formatDistance = (distance) => {
    if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
    return `${distance.toFixed(2)} KM`;
  };

  // ⭐ FINAL FIX — Geolocation permission + allow message
  const handleGetLocation = () => {
    setChecking(true);

    // Ask browser permission FIRST (fix for deploy on HTTPS)
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          alert("⚠ Please allow Location access from browser settings to continue.");
          setChecking(false);
        }
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
        setUserDistance(distance);
        setDeliveryAvailable(true);

        setUser({ ...user, lat, lng });

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.display_name) setUserAddress(data.display_name);
          });

        setChecking(false);
      },
      () => {
        alert("⚠ Location blocked! Please enable GPS permission to place order.");
        setChecking(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Calculate totals
  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price.replace("₹", "")) * item.qty,
    0
  );

  const deliveryCharge = totalAmount >= 499 ? 0 : 40;
  const grandTotal = totalAmount + deliveryCharge;

  // ⭐ Payment navigation
  const handlePayment = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!userAddress) {
      alert("⚠ Please click location button and allow GPS.");
      return;
    }

    const deliveryInfo = {
      fullAddress: userAddress,
      phone: user?.phone || "",
      coords: { lat: user?.lat, lng: user?.lng },
      distance: userDistance,
    };

    localStorage.setItem("apnaSwad_delivery_info", JSON.stringify(deliveryInfo));
    localStorage.removeItem("apnaSwad_order_saved"); // reset duplicate protection

    const orderId = Date.now().toString();
    localStorage.setItem("apnaSwad_current_order", orderId);

    navigate("/payment");
  };

  return (
    <div className="summary-container">
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="address-section">
        <h3>Delivery Location</h3>
        <button
          className="change-address-btn"
          onClick={handleGetLocation}
          disabled={checking}
        >
          {checking ? "Detecting GPS location..." : "Click here for Your Location"}
        </button>

        {deliveryAvailable === true && (
          <p style={{ color: "green", marginTop: 10, lineHeight: "22px" }}>
            ✔ Delivery available 🎉 <br />
            📍 Distance: {formatDistance(userDistance)} <br />
            📌 <b>Your address:</b> <br />
            {userAddress}
          </p>
        )}
      </div>

      <div className="items-section">
        <h3>Order Summary</h3>
        {cart.map((item, index) => (
          <div className="summary-item" key={index}>
            <img src={item.img} alt="" />
            <div>
              <p className="item-name">{item.name}</p>
              <p className="item-option">{item.option}</p>
              <p>Qty: {item.qty}</p>
            </div>
            <p className="item-price">₹{item.price.replace("₹", "")}</p>
          </div>
        ))}
      </div>

      <div className="price-section">
        <h3>Price Details</h3>
        <div className="price-row">
          <p>Subtotal</p>
          <p>₹{totalAmount}</p>
        </div>
        <div className="price-row">
          <p>Delivery Charges</p>
          <p style={{ color: deliveryCharge === 0 ? "green" : "black" }}>
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
          </p>
        </div>
        <div className="price-total">
          <strong>Total Amount</strong>
          <strong>₹{grandTotal}</strong>
        </div>

        {deliveryAvailable === true && (
          <button className="payment-btn" onClick={handlePayment}>
            Proceed to Payment
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}
