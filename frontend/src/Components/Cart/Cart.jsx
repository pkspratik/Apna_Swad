
// import React, { useState } from "react";
// import "./Cart.css";

// import { useCart } from "../../context/CartContext";
// import { useAuth } from "../../context/AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";

// import { NevBar } from "../Heder_Nev/NevBar";
// import { Footer } from "../Footer/Footer";

// export function Cart() {
//   const { cart, increaseQty, decreaseQty, removeItem } = useCart();
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const [checking, setChecking] = useState(false);
//   const [deliveryAvailable, setDeliveryAvailable] = useState(null);
//   const [userDistance, setUserDistance] = useState(null);
//   const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

//   // Restaurant coordinates
//   const restaurantLat = 26.033207;
//   const restaurantLng = 84.835460;

//   // Convert degrees to radians
//   const toRad = (value) => (value * Math.PI) / 180;

//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const φ1 = toRad(lat1);
//     const φ2 = toRad(lat2);
//     const Δφ = toRad(lat2 - lat1);
//     const Δλ = toRad(lon2 - lon1);

//     const a =
//       Math.sin(Δφ / 2) ** 2 +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

//     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
//   };

//   const formatDistance = (distance) => {
//     if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
//     return `${distance.toFixed(2)} KM`;
//   };

//   // Instagram browser detection (Android disables geolocation)
//   const isInstagramBrowser = () =>
//     navigator.userAgent.includes("Instagram");

//   // ====================================================
//   // 🔥 RELIABLE GPS FUNCTION — WITH RETRY (3 ATTEMPTS)
//   // ====================================================
//   const getAccurateLocation = () => {
//     return new Promise((resolve, reject) => {
//       let tries = 0;

//       const attempt = () => {
//         tries++;

//         navigator.geolocation.getCurrentPosition(
//           (pos) => resolve(pos),
//           (err) => {
//             if (tries < 3) {
//               setTimeout(attempt, 1000);
//             } else {
//               reject(err);
//             }
//           },
//           {
//             enableHighAccuracy: true,
//             timeout: 3000,
//             maximumAge: 0,
//           }
//         );
//       };

//       attempt();
//     });
//   };

//   // ====================================================
//   // 🔥 MAIN DELIVERY CHECK — UPDATED FOR ALL DEVICES
//   // ====================================================
//   const handleCheckDelivery = async () => {
//     if (!user) {
//       alert("Please login first to check delivery availability");
//       navigate("/login?redirect=cart");
//       return;
//     }

//     if (isInstagramBrowser()) {
//       alert("Location is blocked inside Instagram browser. Please open in Chrome.");
//       return;
//     }

//     setChecking(true);
//     setDeliveryCheckedOnce(true);

//     // Check Permission state (Android fix)
//     try {
//       if (navigator.permissions) {
//         const perm = await navigator.permissions.query({ name: "geolocation" });
//         if (perm.state === "denied") {
//           alert("Please allow location in Chrome → Site Settings → Location → Allow");
//           setChecking(false);
//           return;
//         }
//       }
//     } catch { }

//     // TRY GPS WITH RETRY SYSTEM
//     try {
//       const pos = await getAccurateLocation();

//       const lat = pos.coords.latitude;
//       const lng = pos.coords.longitude;

//       const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
//       setUserDistance(distance);

//       setDeliveryAvailable(distance <= 60);

//       setUser({ ...user, lat, lng });

//       setChecking(false);
//       return;
//     } catch (gpsError) {
//       console.log("GPS failed after retries:", gpsError);
//     }

//     // ========================================================
//     // 🔥 FALLBACK: IP BASED LOCATION (only if GPS truly fails)
//     // ========================================================
//     try {
//       const fallback = await fetch("https://ipapi.co/json/").then((res) =>
//         res.json()
//       );

//       if (fallback?.latitude) {
//         const distance = getDistance(
//           fallback.latitude,
//           fallback.longitude,
//           restaurantLat,
//           restaurantLng
//         );

//         setUserDistance(distance);
//         setDeliveryAvailable(distance <= 60);

//         setUser({
//           ...user,
//           lat: fallback.latitude,
//           lng: fallback.longitude,
//         });

//         alert("GPS unavailable, used approximate location.");
//         setChecking(false);
//         return;
//       }
//     } catch { }

//     // If even fallback fails
//     alert("Unable to detect location. Please turn ON GPS and try again.");
//     setChecking(false);
//   };

//   // Checkout
//   const handleCheckout = () => {
//     if (!user) {
//       alert("Please login before checkout");
//       navigate("/login?redirect=summary");
//       return;
//     }

//     if (deliveryAvailable !== true) {
//       alert("Please check delivery availability first");
//       return;
//     }

//     navigate("/summary");
//   };

//   // ====================================================
//   // 🔥 SAFE TOTAL AMOUNT CALCULATION — NO NaN EVER
//   // ====================================================
//   const totalAmount = cart.reduce((sum, item) => {
//     let rawPrice = item.price || "0";

//     rawPrice = rawPrice.toString().replace("₹", "").trim();

//     const price = Number(rawPrice);
//     const finalPrice = isNaN(price) ? 0 : price;

//     return sum + finalPrice * item.qty;
//   }, 0);

//   return (
//     <div className="cart-wrapper">
//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       <div className="cart-header">
//         <h2>Your Cart</h2>
//       </div>

//       {/* Delivery Check Button */}
//       <button
//         className="checkout-btn"
//         onClick={handleCheckDelivery}
//         disabled={checking || deliveryCheckedOnce}
//         style={{
//           opacity: deliveryCheckedOnce ? 0.6 : 1,
//           cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
//         }}
//       >
//         {checking
//           ? "Checking..."
//           : deliveryCheckedOnce
//             ? "Delivery Checked ✔"
//             : "Check food delivery availability"}
//       </button>

//       {/* Delivery Status */}
//       {deliveryAvailable === true && (
//         <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
//           ✔ Food delivery is available 🎉 <br />
//           📍 Distance: {formatDistance(userDistance)}
//         </p>
//       )}

//       {deliveryAvailable === false && (
//         <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
//           ❌ Delivery not available (Only within 60 KM) <br />
//           📍 Distance: {formatDistance(userDistance)}
//         </p>
//       )}

//       {cart.length === 0 ? (
//         <div className="empty-cart">
//           <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" />
//           <h3>Your cart is empty</h3>
//           <p>Add something tasty!</p>
//         </div>
//       ) : (
//         <>
//           <div className="cart-list">
//             {cart.map((item, index) => (
//               <div className="cart-item" key={index}>
//                 <img src={item.img} alt="" />
//                 <div className="item-details">
//                   <h3>{item.name}</h3>
//                   <p className="item-option">{item.option}</p>

//                   <p className="item-price">₹{item.price.toString().replace("₹", "")}</p>

//                   <div className="qty-controls">
//                     <button onClick={() => decreaseQty(index)}>-</button>
//                     <span>{item.qty}</span>
//                     <button onClick={() => increaseQty(index)}>+</button>
//                   </div>
//                 </div>

//                 <button className="remove-item" onClick={() => removeItem(index)}>
//                   ✖
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="cart-footer">
//             <div className="total-row">
//               <p>Total Amount</p>
//               <h3>₹{totalAmount}</h3>
//             </div>

//             {deliveryAvailable === true && (
//               <button className="checkout-btn" onClick={handleCheckout}>
//                 Proceed to Checkout
//               </button>
//             )}
//           </div>
//         </>
//       )}

//       <Footer />
//     </div>
//   );
// }



// import React, { useState } from "react";
// import "./Cart.css";

// import { useCart } from "../../context/CartContext";
// import { useAuth } from "../../context/AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";

// import { NevBar } from "../Heder_Nev/NevBar";
// import { Footer } from "../Footer/Footer";

// export function Cart() {
//   const { cart, increaseQty, decreaseQty, removeItem } = useCart();
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const [checking, setChecking] = useState(false);
//   const [deliveryAvailable, setDeliveryAvailable] = useState(null);
//   const [userDistance, setUserDistance] = useState(null);
//   const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

//   // Restaurant Location
//   const restaurantLat = 26.033207;
//   const restaurantLng = 84.835460;

//   // Convert to radians
//   const toRad = (value) => (value * Math.PI) / 180;

//   // Calculate distance
//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const φ1 = toRad(lat1);
//     const φ2 = toRad(lat2);
//     const Δφ = toRad(lat2 - lat1);
//     const Δλ = toRad(lon2 - lon1);

//     const a =
//       Math.sin(Δφ / 2) ** 2 +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

//     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
//   };

//   const formatDistance = (distance) => {
//     if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
//     return `${distance.toFixed(2)} KM`;
//   };

//   const isInstagramBrowser = () =>
//     navigator.userAgent.includes("Instagram");

//   // ================================================
//   // 🔥 HIGH-ACCURACY GPS FUNCTION (BEST FOR ANDROID)
//   // ================================================
//   const getPreciseLocation = () => {
//     return new Promise((resolve, reject) => {
//       let timeoutReached = false;

//       // Manual timeout
//       const timer = setTimeout(() => {
//         timeoutReached = true;
//         reject({ message: "GPS timeout" });
//       }, 15000);

//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           clearTimeout(timer);
//           if (!timeoutReached) {
//             resolve({
//               lat: pos.coords.latitude,
//               lng: pos.coords.longitude,
//               accuracy: pos.coords.accuracy,
//             });
//           }
//         },
//         (err) => {
//           clearTimeout(timer);
//           reject(err);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 0,
//         }
//       );
//     });
//   };

//   // ================================================
//   // 🔥 Delivery Check with REAL GPS accuracy
//   // ================================================
//   const handleCheckDelivery = async () => {
//     if (!user) {
//       alert("Please login first to check delivery availability");
//       navigate("/login?redirect=cart");
//       return;
//     }

//     if (isInstagramBrowser()) {
//       alert("Location blocked inside Instagram browser. Please open in Chrome.");
//       return;
//     }

//     setChecking(true);
//     setDeliveryCheckedOnce(true);

//     // Check browser permission
//     try {
//       if (navigator.permissions) {
//         const perm = await navigator.permissions.query({ name: "geolocation" });
//         if (perm.state === "denied") {
//           alert("Allow location: Chrome → Site Settings → Location → Allow");
//           setChecking(false);
//           return;
//         }
//       }
//     } catch { }

//     // 1️⃣ Try precise GPS first
//     try {
//       const gps = await getPreciseLocation();

//       console.log("GPS Accuracy (meters):", gps.accuracy);

//       if (gps.accuracy > 50) {
//         alert(
//           "GPS signal is weak. Move to open sky or near a window for accurate distance."
//         );
//       }

//       const distance = getDistance(gps.lat, gps.lng, restaurantLat, restaurantLng);
//       setUserDistance(distance);
//       setDeliveryAvailable(distance <= 60);

//       setUser({ ...user, lat: gps.lat, lng: gps.lng });

//       setChecking(false);
//       return;
//     } catch (err) {
//       console.log("GPS Error:", err);
//     }

//     // 2️⃣ Fallback: IP approximate location
//     try {
//       const fallback = await fetch("https://ipapi.co/json/").then((res) =>
//         res.json()
//       );

//       if (fallback?.latitude) {
//         const distance = getDistance(
//           fallback.latitude,
//           fallback.longitude,
//           restaurantLat,
//           restaurantLng
//         );

//         setUserDistance(distance);
//         setDeliveryAvailable(distance <= 60);

//         setUser({
//           ...user,
//           lat: fallback.latitude,
//           lng: fallback.longitude,
//         });

//         alert(
//           "Precise GPS unavailable — using approximate location based on your network."
//         );
//         setChecking(false);
//         return;
//       }
//     } catch { }

//     // 3️⃣ If everything fails
//     alert("Unable to detect location. Please enable GPS manually & try again.");
//     setChecking(false);
//   };

//   const handleCheckout = () => {
//     if (!user) {
//       alert("Please login before checkout");
//       navigate("/login?redirect=summary");
//       return;
//     }

//     if (deliveryAvailable !== true) {
//       alert("Please check delivery availability first");
//       return;
//     }

//     navigate("/summary");
//   };

//   // ================================================
//   // 🔥 SAFE TOTAL PRICE (NO NaN EVER)
//   // ================================================
//   const totalAmount = cart.reduce((sum, item) => {
//     let price = item?.price ?? 0;
//     price = price.toString().replace(/[^\d.]/g, "");
//     const finalPrice = Number(price);
//     const qty = Number(item?.qty ?? 0);
//     return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (isNaN(qty) ? 0 : qty);
//   }, 0);

//   return (
//     <div className="cart-wrapper">
//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       <div className="cart-header">
//         <h2>Your Cart</h2>
//       </div>

//       <button
//         className="checkout-btn"
//         onClick={handleCheckDelivery}
//         disabled={checking || deliveryCheckedOnce}
//         style={{
//           opacity: deliveryCheckedOnce ? 0.6 : 1,
//           cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
//         }}
//       >
//         {checking
//           ? "Checking..."
//           : deliveryCheckedOnce
//             ? "Delivery Checked ✔"
//             : "Check food delivery availability"}
//       </button>

//       {deliveryAvailable === true && (
//         <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
//           ✔ Food delivery available 🎉 <br />
//           📍 Distance: {formatDistance(userDistance)}
//         </p>
//       )}

//       {deliveryAvailable === false && (
//         <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
//           ❌ Delivery not available (Only within 60 KM) <br />
//           📍 Distance: {formatDistance(userDistance)}
//         </p>
//       )}

//       {cart.length === 0 ? (
//         <div className="empty-cart">
//           <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" />
//           <h3>Your cart is empty</h3>
//           <p>Add something tasty!</p>
//         </div>
//       ) : (
//         <>
//           <div className="cart-list">
//             {cart.map((item, index) => (
//               <div className="cart-item" key={index}>
//                 <img src={item.img} alt="" />
//                 <div className="item-details">
//                   <h3>{item.name}</h3>
//                   <p className="item-option">{item.option}</p>

//                   <p className="item-price">
//                     ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
//                   </p>

//                   <div className="qty-controls">
//                     <button onClick={() => decreaseQty(index)}>-</button>
//                     <span>{item.qty}</span>
//                     <button onClick={() => increaseQty(index)}>+</button>
//                   </div>
//                 </div>

//                 <button className="remove-item" onClick={() => removeItem(index)}>
//                   ✖
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="cart-footer">
//             <div className="total-row">
//               <p>Total Amount</p>
//               <h3>₹{totalAmount}</h3>
//             </div>

//             {deliveryAvailable === true && (
//               <button className="checkout-btn" onClick={handleCheckout}>
//                 Proceed to Checkout
//               </button>
//             )}
//           </div>
//         </>
//       )}

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

  // watchPosition helper (same logic as Cart)
  const getBestLocation = ({ desiredAccuracy = 30, timeout = 20000 } = {}) => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      let best = null;
      let watcher = null;
      let timedOut = false;

      const finish = (pos) => {
        if (watcher) navigator.geolocation.clearWatch(watcher);
        resolve(pos);
      };

      const abort = (err) => {
        if (watcher) navigator.geolocation.clearWatch(watcher);
        reject(err);
      };

      const timer = setTimeout(() => {
        timedOut = true;
        if (best) finish(best);
        else abort(new Error("timeout"));
      }, timeout);

      try {
        watcher = navigator.geolocation.watchPosition(
          (pos) => {
            if (!best || (pos.coords && pos.coords.accuracy < best.coords.accuracy)) {
              best = pos;
            }

            if (pos.coords && pos.coords.accuracy && pos.coords.accuracy <= desiredAccuracy) {
              clearTimeout(timer);
              finish(pos);
            }
          },
          (err) => {
            clearTimeout(timer);
            abort(err);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
      } catch (e) {
        clearTimeout(timer);
        abort(e);
      }
    });
  };

  const handleGetLocation = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login?redirect=summary");
      return;
    }

    setChecking(true);

    try {
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

      let lat = null;
      let lng = null;
      let pos = null;

      try {
        pos = await getBestLocation({ desiredAccuracy: 40, timeout: 20000 });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (gpsErr) {
        console.log("GPS watch failed:", gpsErr.message || gpsErr);
      }

      if (!lat || !lng) {
        try {
          const fallback = await fetch("https://ipapi.co/json/").then((r) => r.json());
          if (fallback?.latitude && fallback?.longitude) {
            lat = fallback.latitude;
            lng = fallback.longitude;
            setUserAddress(`${fallback.city}, ${fallback.region}, ${fallback.country_name}`);
          }
        } catch (e) {
          console.log("IP fallback failed", e);
        }
      }

      if (!lat || !lng) {
        alert("Unable to detect location. Please enable GPS and try again.");
        setManualEntry(true);
        setChecking(false);
        return;
      }

      const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
      setUserDistance(distance);
      setDeliveryAvailable(true);
      setLocationChecked(true);

      setUser({ ...user, lat, lng });

      // if we got a GPS pos, reverse geocode it; otherwise userAddress already set for fallback
      if (pos?.coords) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          if (data?.display_name) setUserAddress(data.display_name);
          else setManualEntry(true);
        } catch {
          setManualEntry(true);
        }
      }

    } finally {
      setChecking(false);
    }
  };

  // SAFE price calc
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
            📍 Distance: {userDistance ? (userDistance * 1000 < 1000 ? `${(userDistance * 1000).toFixed(0)} meters` : `${userDistance.toFixed(2)} KM`) : "--"}<br /><br />
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

            <p className="item-price">₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}</p>
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
