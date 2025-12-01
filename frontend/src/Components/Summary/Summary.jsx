
// import React, { useState } from "react";
// import "./Summary.css";
// import { useCart } from "../../context/CartContext";
// import { useAuth } from "../../context/AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";

// import { NevBar } from "../Heder_Nev/NevBar.jsx";
// import { Footer } from "../Footer/Footer.jsx";

// export function Summary() {
//   const { cart } = useCart();
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const [checking, setChecking] = useState(false);
//   const [deliveryAvailable, setDeliveryAvailable] = useState(false);
//   const [userDistance, setUserDistance] = useState(null);
//   const [userAddress, setUserAddress] = useState("");
//   const [manualEntry, setManualEntry] = useState(false);

//   const [locationChecked, setLocationChecked] = useState(false);

//   const restaurantLat = 26.033197;
//   const restaurantLng = 84.835471;

//   const toRad = (v) => (v * Math.PI) / 180;

//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) ** 2;

//     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
//   };

//   const formatDistance = (d) => {
//     if (d * 1000 < 1000) return `${(d * 1000).toFixed(0)} meters`;
//     return `${d.toFixed(2)} KM`;
//   };

//   const isInstagramBrowser = () =>
//     navigator.userAgent.includes("Instagram");

//   // ======================================================
//   // 📍 Auto Location Detect
//   // ======================================================
//   const handleGetLocation = async () => {
//     if (!user) {
//       alert("Please login first");
//       navigate("/login?redirect=summary");
//       return;
//     }

//     if (isInstagramBrowser()) {
//       alert("Location blocked inside Instagram browser. Open in Chrome.");
//       return;
//     }

//     setChecking(true);

//     try {
//       if (navigator.permissions) {
//         const perm = await navigator.permissions.query({ name: "geolocation" });
//         if (perm.state === "denied") {
//           alert("Enable location: Chrome → Site Settings → Location → Allow");
//           setChecking(false);
//           return;
//         }
//       }
//     } catch { }

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;

//         const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
//         setUserDistance(distance);

//         setDeliveryAvailable(true);
//         setLocationChecked(true);
//         setUser({ ...user, lat, lng });

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//           );
//           const data = await res.json();
//           if (data?.display_name) setUserAddress(data.display_name);
//           else setManualEntry(true);
//         } catch {
//           setManualEntry(true);
//         }

//         setChecking(false);
//       },
//       async () => {
//         const fallback = await fetch("https://ipapi.co/json/")
//           .then((r) => r.json())
//           .catch(() => null);

//         if (fallback?.latitude) {
//           const distance = getDistance(
//             fallback.latitude,
//             fallback.longitude,
//             restaurantLat,
//             restaurantLng
//           );

//           setUserDistance(distance);
//           setDeliveryAvailable(true);
//           setLocationChecked(true);

//           setUser({
//             ...user,
//             lat: fallback.latitude,
//             lng: fallback.longitude,
//           });

//           setUserAddress(
//             `${fallback.city}, ${fallback.region}, ${fallback.country_name}`
//           );

//           alert("GPS unavailable — using approximate location.");
//           setChecking(false);
//           return;
//         }

//         alert("Location request timed out. Turn ON GPS.");
//         setChecking(false);
//         setManualEntry(true);
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 8000,
//         maximumAge: 20000,
//       }
//     );
//   };

//   // ======================================================
//   // 💰 PRICE CALCULATION — SAFE (NO replace ERROR)
//   // ======================================================
//   const totalAmount = cart.reduce((sum, item) => {
//     let price = item?.price ?? 0;

//     price = price.toString().replace(/[^\d.]/g, "");
//     const finalPrice = Number(price);

//     return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (item.qty ?? 0);
//   }, 0);

//   const deliveryCharge = totalAmount >= 499 ? 0 : 40;
//   const grandTotal = totalAmount + deliveryCharge;

//   const handlePayment = () => {
//     if (!user) {
//       alert("Please login to continue");
//       navigate("/login?redirect=summary");
//       return;
//     }

//     if (!userAddress) {
//       alert("Please provide your full address.");
//       return;
//     }

//     localStorage.setItem(
//       "apnaSwad_delivery_info",
//       JSON.stringify({
//         fullAddress: userAddress,
//         phone: user?.phone || "",
//         coords: user?.lat ? { lat: user.lat, lng: user.lng } : null,
//         distance: userDistance,
//       })
//     );

//     navigate("/payment");
//   };

//   return (
//     <div className="summary-container">
//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       {/* Address Section */}
//       <div className="address-section">
//         <h3>Delivery Location</h3>

//         <button
//           className="change-address-btn"
//           onClick={handleGetLocation}
//           disabled={checking || locationChecked}
//         >
//           {checking ? "Checking..." : "Click to Auto Detect Location"}
//         </button>

//         {deliveryAvailable && (
//           <p style={{ color: "green", marginTop: 10 }}>
//             ✔ Delivery available<br />
//             📍 Distance: {formatDistance(userDistance)}<br /><br />
//             📌 <b>Your address:</b><br />
//             {userAddress}
//           </p>
//         )}

//         {manualEntry && (
//           <div style={{ marginTop: 20 }}>
//             <label><b>Enter Address Manually:</b></label>
//             <textarea
//               className="manual-address-box"
//               placeholder="Type your full address here..."
//               value={userAddress}
//               onChange={(e) => setUserAddress(e.target.value)}
//             />
//           </div>
//         )}
//       </div>

//       {/* Items Section */}
//       <div className="items-section">
//         <h3>Order Summary</h3>

//         {cart.map((item, idx) => (
//           <div className="summary-item" key={idx}>
//             <img src={item.img} alt={item.name} />

//             <div>
//               <p className="item-name">{item.name}</p>
//               <p className="item-option">{item.option}</p>
//               <p>Qty: {item.qty}</p>
//             </div>

//             {/* FIXED PRICE DISPLAY */}
//             <p className="item-price">
//               ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Price Section */}
//       <div className="price-section">
//         <h3>Price Details</h3>

//         <div className="price-row">
//           <p>Subtotal</p>
//           <p>₹{totalAmount}</p>
//         </div>

//         <div className="price-row">
//           <p>Delivery Charges</p>
//           <p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p>
//         </div>

//         <div className="price-total">
//           <strong>Total Amount</strong>
//           <strong>₹{grandTotal}</strong>
//         </div>

//         {locationChecked && (
//           <button className="payment-btn" onClick={handlePayment}>
//             Proceed to Payment
//           </button>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// }




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
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [userDistance, setUserDistance] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);

  // Restaurant Coordinates
  const restaurantLat = 26.033197;
  const restaurantLng = 84.835471;

  const toRad = (v) => (v * Math.PI) / 180;

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const formatDistance = (d) =>
    d * 1000 < 1000 ? `${(d * 1000).toFixed(0)} meters` : `${d.toFixed(2)} KM`;

  const isInstagramBrowser = () =>
    navigator.userAgent.includes("Instagram");

  // =======================================================
  // 🔥 HIGH-ACCURACY GPS (Same as Cart.jsx)
  // =======================================================
  const getPreciseLocation = () => {
    return new Promise((resolve, reject) => {
      let timeoutReached = false;

      const timer = setTimeout(() => {
        timeoutReached = true;
        reject({ message: "GPS timeout" });
      }, 15000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          if (!timeoutReached) {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
          }
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  // =======================================================
  // 📍 LOCATION DETECTION
  // =======================================================
  const handleGetLocation = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login?redirect=summary");
      return;
    }

    if (isInstagramBrowser()) {
      alert("Location blocked inside Instagram browser. Please open in Chrome.");
      return;
    }

    setChecking(true);

    // Check Permissions
    try {
      if (navigator.permissions) {
        const perm = await navigator.permissions.query({ name: "geolocation" });
        if (perm.state === "denied") {
          alert("Enable location: Chrome → Site Settings → Location → Allow");
          setChecking(false);
          return;
        }
      }
    } catch { }

    // 1️⃣ Try precise GPS
    try {
      const gps = await getPreciseLocation();

      if (gps.accuracy > 50) {
        alert(
          "Weak GPS signal. Move near a window or in open area for better accuracy."
        );
      }

      const distance = getDistance(
        gps.lat,
        gps.lng,
        restaurantLat,
        restaurantLng
      );

      setUserDistance(distance);
      setDeliveryAvailable(true);
      setLocationChecked(true);

      setUser({ ...user, lat: gps.lat, lng: gps.lng });

      // Reverse Geocoding
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gps.lat}&lon=${gps.lng}`
        );
        const data = await res.json();

        if (data?.display_name) {
          setUserAddress(data.display_name);
        } else {
          setManualEntry(true);
        }
      } catch {
        setManualEntry(true);
      }

      setChecking(false);
      return;
    } catch (err) {
      console.log("GPS failed:", err);
    }

    // 2️⃣ Fallback: IP Approximate Location
    try {
      const fallback = await fetch("https://ipapi.co/json/").then((r) =>
        r.json()
      );

      if (fallback?.latitude) {
        const distance = getDistance(
          fallback.latitude,
          fallback.longitude,
          restaurantLat,
          restaurantLng
        );

        setUserDistance(distance);
        setDeliveryAvailable(true);
        setLocationChecked(true);

        setUser({
          ...user,
          lat: fallback.latitude,
          lng: fallback.longitude,
        });

        setUserAddress(
          `${fallback.city}, ${fallback.region}, ${fallback.country_name}`
        );

        alert(
          "Precise GPS unavailable — using approximate location based on your network."
        );
        setChecking(false);
        return;
      }
    } catch { }

    alert("Unable to detect location. Please enable GPS manually.");
    setChecking(false);
    setManualEntry(true);
  };

  // =======================================================
  // 💰 SAFE PRICE CALCULATION
  // =======================================================
  const totalAmount = cart.reduce((sum, item) => {
    let price = item?.price ?? 0;
    price = price.toString().replace(/[^\d.]/g, "");
    const finalPrice = Number(price);
    return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (item.qty ?? 0);
  }, 0);

  const deliveryCharge = totalAmount >= 499 ? 0 : 40;
  const grandTotal = totalAmount + deliveryCharge;

  const handlePayment = () => {
    if (!user) {
      alert("Please login to continue");
      navigate("/login?redirect=summary");
      return;
    }

    if (!userAddress) {
      alert("Please provide your full address.");
      return;
    }

    localStorage.setItem(
      "apnaSwad_delivery_info",
      JSON.stringify({
        fullAddress: userAddress,
        phone: user?.phone || "",
        coords: user?.lat ? { lat: user.lat, lng: user.lng } : null,
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
          onClick={handleGetLocation}
          disabled={checking || locationChecked}
        >
          {checking ? "Checking..." : "Click to Auto Detect Location"}
        </button>

        {deliveryAvailable && (
          <p style={{ color: "green", marginTop: 10 }}>
            ✔ Delivery available<br />
            📍 Distance: {formatDistance(userDistance)}<br /><br />
            <b>Your address:</b><br />
            {userAddress}
          </p>
        )}

        {manualEntry && (
          <div style={{ marginTop: 20 }}>
            <label><b>Enter Address Manually:</b></label>
            <textarea
              className="manual-address-box"
              placeholder="Type your full address here..."
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Items Section */}
      <div className="items-section">
        <h3>Order Summary</h3>

        {cart.map((item, idx) => (
          <div className="summary-item" key={idx}>
            <img src={item.img} alt={item.name} />

            <div>
              <p className="item-name">{item.name}</p>
              <p className="item-option">{item.option}</p>
              <p>Qty: {item.qty}</p>
            </div>

            <p className="item-price">
              ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
            </p>
          </div>
        ))}
      </div>

      {/* Price Section */}
      <div className="price-section">
        <h3>Price Details</h3>

        <div className="price-row">
          <p>Subtotal</p>
          <p>₹{totalAmount}</p>
        </div>

        <div className="price-row">
          <p>Delivery Charges</p>
          <p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p>
        </div>

        <div className="price-total">
          <strong>Total Amount</strong>
          <strong>₹{grandTotal}</strong>
        </div>

        {locationChecked && (
          <button className="payment-btn" onClick={handlePayment}>
            Proceed to Payment
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}


