import React, { useState } from "react";
import "./Summary.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

import { NevBar } from "../Heder_Nev/NevBar.jsx";
import { Footer } from "../Footer/Footer.jsx";

export function Summary() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [userDistance, setUserDistance] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  const restaurantLat = 26.033197;
  const restaurantLng = 84.835471;

  // ---------------------------------------------------------
  // 🔢 Distance Functions
  // ---------------------------------------------------------
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

  const formatDistance = (d) =>
    d * 1000 < 1000 ? `${(d * 1000).toFixed(0)} meters` : `${d.toFixed(2)} KM`;

  // ---------------------------------------------------------
  // 📍 GET USER LOCATION
  // ---------------------------------------------------------
  const handleGetLocation = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login?redirect=summary");
      return;
    }

    setChecking(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const dist = getDistance(lat, lng, restaurantLat, restaurantLng);
        setUserDistance(dist);

        setDeliveryAvailable(true);

        // Reverse Geocoding
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          const data = await res.json();
          if (data?.display_name) setUserAddress(data.display_name);
        } catch (e) {
          alert("Unable to fetch address");
        }

        setChecking(false);
      },
      () => {
        alert("Please enable GPS location");
        setChecking(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // ---------------------------------------------------------
  // 💰 PRICE CALCULATION
  // ---------------------------------------------------------
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price.replace("₹", "")) * item.qty,
    0
  );

  const deliveryCharge = subtotal >= 499 ? 0 : 40;
  const grandTotal = subtotal + deliveryCharge;

  // ---------------------------------------------------------
  // ⭐ PROCEED TO PAYMENT
  // ---------------------------------------------------------
  const handlePayment = () => {
    if (!user) {
      alert("Login required to continue");
      navigate("/login?redirect=summary");
      return;
    }

    if (!userAddress) {
      alert("Please detect your GPS location first");
      return;
    }

    // Save delivery details
    localStorage.setItem(
      "apnaSwad_delivery_info",
      JSON.stringify({
        fullAddress: userAddress,
        phone: user?.phone || "",
        coords: { lat: user?.lat || null, lng: user?.lng || null },
        distance: userDistance,
      })
    );

    navigate("/payment");
  };

  return (
    <div className="summary-container">
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      {/* Address Section */}
      <div className="address-section">
        <h3>Delivery Location</h3>

        <button
          className="change-address-btn"
          disabled={checking}
          onClick={handleGetLocation}
        >
          {checking ? "Detecting GPS..." : "Click here for Your Location"}
        </button>

        {deliveryAvailable && (
          <p style={{ color: "green", marginTop: 10 }}>
            ✔ Delivery available <br />
            📍 Distance: {formatDistance(userDistance)} <br /> <br />
            📌 <b>Your address:</b> <br />
            {userAddress}
          </p>
        )}
      </div>

      {/* Items Section */}
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

      {/* Price Section */}
      <div className="price-section">
        <h3>Price Details</h3>

        <div className="price-row">
          <p>Subtotal</p>
          <p>₹{subtotal}</p>
        </div>

        <div className="price-row">
          <p>Delivery Charges</p>
          <p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p>
        </div>

        <div className="price-total">
          <strong>Total Amount</strong>
          <strong>₹{grandTotal}</strong>
        </div>

        {deliveryAvailable && (
          <button className="payment-btn" onClick={handlePayment}>
            Proceed to Payment
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}
