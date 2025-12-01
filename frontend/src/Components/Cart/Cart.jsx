
// // import React, { useState } from "react";
// // import "./Cart.css";

// // import { useCart } from "../../context/CartContext";
// // import { useAuth } from "../../context/AuthContext/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // import { NevBar } from "../Heder_Nev/NevBar";
// // import { Footer } from "../Footer/Footer";

// // export function Cart() {
// //   const { cart, increaseQty, decreaseQty, removeItem } = useCart();
// //   const { user, setUser } = useAuth();
// //   const navigate = useNavigate();

// //   const [checking, setChecking] = useState(false);
// //   const [deliveryAvailable, setDeliveryAvailable] = useState(null);
// //   const [userDistance, setUserDistance] = useState(null);
// //   const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

// //   // Restaurant coordinates
// //   const restaurantLat = 26.033207;
// //   const restaurantLng = 84.835460;

// //   // Convert degrees to radians
// //   const toRad = (value) => (value * Math.PI) / 180;

// //   const getDistance = (lat1, lon1, lat2, lon2) => {
// //     const R = 6371;
// //     const φ1 = toRad(lat1);
// //     const φ2 = toRad(lat2);
// //     const Δφ = toRad(lat2 - lat1);
// //     const Δλ = toRad(lon2 - lon1);

// //     const a =
// //       Math.sin(Δφ / 2) ** 2 +
// //       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

// //     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// //   };

// //   const formatDistance = (distance) => {
// //     if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
// //     return `${distance.toFixed(2)} KM`;
// //   };

// //   // Instagram browser detection (Android disables geolocation)
// //   const isInstagramBrowser = () =>
// //     navigator.userAgent.includes("Instagram");

// //   // ====================================================
// //   // 🔥 RELIABLE GPS FUNCTION — WITH RETRY (3 ATTEMPTS)
// //   // ====================================================
// //   const getAccurateLocation = () => {
// //     return new Promise((resolve, reject) => {
// //       let tries = 0;

// //       const attempt = () => {
// //         tries++;

// //         navigator.geolocation.getCurrentPosition(
// //           (pos) => resolve(pos),
// //           (err) => {
// //             if (tries < 3) {
// //               setTimeout(attempt, 1000);
// //             } else {
// //               reject(err);
// //             }
// //           },
// //           {
// //             enableHighAccuracy: true,
// //             timeout: 3000,
// //             maximumAge: 0,
// //           }
// //         );
// //       };

// //       attempt();
// //     });
// //   };

// //   // ====================================================
// //   // 🔥 MAIN DELIVERY CHECK — UPDATED FOR ALL DEVICES
// //   // ====================================================
// //   const handleCheckDelivery = async () => {
// //     if (!user) {
// //       alert("Please login first to check delivery availability");
// //       navigate("/login?redirect=cart");
// //       return;
// //     }

// //     if (isInstagramBrowser()) {
// //       alert("Location is blocked inside Instagram browser. Please open in Chrome.");
// //       return;
// //     }

// //     setChecking(true);
// //     setDeliveryCheckedOnce(true);

// //     // Check Permission state (Android fix)
// //     try {
// //       if (navigator.permissions) {
// //         const perm = await navigator.permissions.query({ name: "geolocation" });
// //         if (perm.state === "denied") {
// //           alert("Please allow location in Chrome → Site Settings → Location → Allow");
// //           setChecking(false);
// //           return;
// //         }
// //       }
// //     } catch { }

// //     // TRY GPS WITH RETRY SYSTEM
// //     try {
// //       const pos = await getAccurateLocation();

// //       const lat = pos.coords.latitude;
// //       const lng = pos.coords.longitude;

// //       const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
// //       setUserDistance(distance);

// //       setDeliveryAvailable(distance <= 60);

// //       setUser({ ...user, lat, lng });

// //       setChecking(false);
// //       return;
// //     } catch (gpsError) {
// //       console.log("GPS failed after retries:", gpsError);
// //     }

// //     // ========================================================
// //     // 🔥 FALLBACK: IP BASED LOCATION (only if GPS truly fails)
// //     // ========================================================
// //     try {
// //       const fallback = await fetch("https://ipapi.co/json/").then((res) =>
// //         res.json()
// //       );

// //       if (fallback?.latitude) {
// //         const distance = getDistance(
// //           fallback.latitude,
// //           fallback.longitude,
// //           restaurantLat,
// //           restaurantLng
// //         );

// //         setUserDistance(distance);
// //         setDeliveryAvailable(distance <= 60);

// //         setUser({
// //           ...user,
// //           lat: fallback.latitude,
// //           lng: fallback.longitude,
// //         });

// //         alert("GPS unavailable, used approximate location.");
// //         setChecking(false);
// //         return;
// //       }
// //     } catch { }

// //     // If even fallback fails
// //     alert("Unable to detect location. Please turn ON GPS and try again.");
// //     setChecking(false);
// //   };

// //   // Checkout
// //   const handleCheckout = () => {
// //     if (!user) {
// //       alert("Please login before checkout");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     if (deliveryAvailable !== true) {
// //       alert("Please check delivery availability first");
// //       return;
// //     }

// //     navigate("/summary");
// //   };

// //   // ====================================================
// //   // 🔥 SAFE TOTAL AMOUNT CALCULATION — NO NaN EVER
// //   // ====================================================
// //   const totalAmount = cart.reduce((sum, item) => {
// //     let rawPrice = item.price || "0";

// //     rawPrice = rawPrice.toString().replace("₹", "").trim();

// //     const price = Number(rawPrice);
// //     const finalPrice = isNaN(price) ? 0 : price;

// //     return sum + finalPrice * item.qty;
// //   }, 0);

// //   return (
// //     <div className="cart-wrapper">
// //       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

// //       <div className="cart-header">
// //         <h2>Your Cart</h2>
// //       </div>

// //       {/* Delivery Check Button */}
// //       <button
// //         className="checkout-btn"
// //         onClick={handleCheckDelivery}
// //         disabled={checking || deliveryCheckedOnce}
// //         style={{
// //           opacity: deliveryCheckedOnce ? 0.6 : 1,
// //           cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
// //         }}
// //       >
// //         {checking
// //           ? "Checking..."
// //           : deliveryCheckedOnce
// //             ? "Delivery Checked ✔"
// //             : "Check food delivery availability"}
// //       </button>

// //       {/* Delivery Status */}
// //       {deliveryAvailable === true && (
// //         <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
// //           ✔ Food delivery is available 🎉 <br />
// //           📍 Distance: {formatDistance(userDistance)}
// //         </p>
// //       )}

// //       {deliveryAvailable === false && (
// //         <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
// //           ❌ Delivery not available (Only within 60 KM) <br />
// //           📍 Distance: {formatDistance(userDistance)}
// //         </p>
// //       )}

// //       {cart.length === 0 ? (
// //         <div className="empty-cart">
// //           <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" />
// //           <h3>Your cart is empty</h3>
// //           <p>Add something tasty!</p>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="cart-list">
// //             {cart.map((item, index) => (
// //               <div className="cart-item" key={index}>
// //                 <img src={item.img} alt="" />
// //                 <div className="item-details">
// //                   <h3>{item.name}</h3>
// //                   <p className="item-option">{item.option}</p>

// //                   <p className="item-price">₹{item.price.toString().replace("₹", "")}</p>

// //                   <div className="qty-controls">
// //                     <button onClick={() => decreaseQty(index)}>-</button>
// //                     <span>{item.qty}</span>
// //                     <button onClick={() => increaseQty(index)}>+</button>
// //                   </div>
// //                 </div>

// //                 <button className="remove-item" onClick={() => removeItem(index)}>
// //                   ✖
// //                 </button>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="cart-footer">
// //             <div className="total-row">
// //               <p>Total Amount</p>
// //               <h3>₹{totalAmount}</h3>
// //             </div>

// //             {deliveryAvailable === true && (
// //               <button className="checkout-btn" onClick={handleCheckout}>
// //                 Proceed to Checkout
// //               </button>
// //             )}
// //           </div>
// //         </>
// //       )}

// //       <Footer />
// //     </div>
// //   );
// // }



// // import React, { useState } from "react";
// // import "./Cart.css";

// // import { useCart } from "../../context/CartContext";
// // import { useAuth } from "../../context/AuthContext/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // import { NevBar } from "../Heder_Nev/NevBar";
// // import { Footer } from "../Footer/Footer";

// // export function Cart() {
// //   const { cart, increaseQty, decreaseQty, removeItem } = useCart();
// //   const { user, setUser } = useAuth();
// //   const navigate = useNavigate();

// //   const [checking, setChecking] = useState(false);
// //   const [deliveryAvailable, setDeliveryAvailable] = useState(null);
// //   const [userDistance, setUserDistance] = useState(null);
// //   const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

// //   // Restaurant Location
// //   const restaurantLat = 26.033207;
// //   const restaurantLng = 84.835460;

// //   // Convert to radians
// //   const toRad = (value) => (value * Math.PI) / 180;

// //   // Calculate distance
// //   const getDistance = (lat1, lon1, lat2, lon2) => {
// //     const R = 6371;
// //     const φ1 = toRad(lat1);
// //     const φ2 = toRad(lat2);
// //     const Δφ = toRad(lat2 - lat1);
// //     const Δλ = toRad(lon2 - lon1);

// //     const a =
// //       Math.sin(Δφ / 2) ** 2 +
// //       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

// //     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// //   };

// //   const formatDistance = (distance) => {
// //     if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
// //     return `${distance.toFixed(2)} KM`;
// //   };

// //   const isInstagramBrowser = () =>
// //     navigator.userAgent.includes("Instagram");

// //   // ================================================
// //   // 🔥 HIGH-ACCURACY GPS FUNCTION (BEST FOR ANDROID)
// //   // ================================================
// //   const getPreciseLocation = () => {
// //     return new Promise((resolve, reject) => {
// //       let timeoutReached = false;

// //       // Manual timeout
// //       const timer = setTimeout(() => {
// //         timeoutReached = true;
// //         reject({ message: "GPS timeout" });
// //       }, 15000);

// //       navigator.geolocation.getCurrentPosition(
// //         (pos) => {
// //           clearTimeout(timer);
// //           if (!timeoutReached) {
// //             resolve({
// //               lat: pos.coords.latitude,
// //               lng: pos.coords.longitude,
// //               accuracy: pos.coords.accuracy,
// //             });
// //           }
// //         },
// //         (err) => {
// //           clearTimeout(timer);
// //           reject(err);
// //         },
// //         {
// //           enableHighAccuracy: true,
// //           timeout: 15000,
// //           maximumAge: 0,
// //         }
// //       );
// //     });
// //   };

// //   // ================================================
// //   // 🔥 Delivery Check with REAL GPS accuracy
// //   // ================================================
// //   const handleCheckDelivery = async () => {
// //     if (!user) {
// //       alert("Please login first to check delivery availability");
// //       navigate("/login?redirect=cart");
// //       return;
// //     }

// //     if (isInstagramBrowser()) {
// //       alert("Location blocked inside Instagram browser. Please open in Chrome.");
// //       return;
// //     }

// //     setChecking(true);
// //     setDeliveryCheckedOnce(true);

// //     // Check browser permission
// //     try {
// //       if (navigator.permissions) {
// //         const perm = await navigator.permissions.query({ name: "geolocation" });
// //         if (perm.state === "denied") {
// //           alert("Allow location: Chrome → Site Settings → Location → Allow");
// //           setChecking(false);
// //           return;
// //         }
// //       }
// //     } catch { }

// //     // 1️⃣ Try precise GPS first
// //     try {
// //       const gps = await getPreciseLocation();

// //       console.log("GPS Accuracy (meters):", gps.accuracy);

// //       if (gps.accuracy > 50) {
// //         alert(
// //           "GPS signal is weak. Move to open sky or near a window for accurate distance."
// //         );
// //       }

// //       const distance = getDistance(gps.lat, gps.lng, restaurantLat, restaurantLng);
// //       setUserDistance(distance);
// //       setDeliveryAvailable(distance <= 60);

// //       setUser({ ...user, lat: gps.lat, lng: gps.lng });

// //       setChecking(false);
// //       return;
// //     } catch (err) {
// //       console.log("GPS Error:", err);
// //     }

// //     // 2️⃣ Fallback: IP approximate location
// //     try {
// //       const fallback = await fetch("https://ipapi.co/json/").then((res) =>
// //         res.json()
// //       );

// //       if (fallback?.latitude) {
// //         const distance = getDistance(
// //           fallback.latitude,
// //           fallback.longitude,
// //           restaurantLat,
// //           restaurantLng
// //         );

// //         setUserDistance(distance);
// //         setDeliveryAvailable(distance <= 60);

// //         setUser({
// //           ...user,
// //           lat: fallback.latitude,
// //           lng: fallback.longitude,
// //         });

// //         alert(
// //           "Precise GPS unavailable — using approximate location based on your network."
// //         );
// //         setChecking(false);
// //         return;
// //       }
// //     } catch { }

// //     // 3️⃣ If everything fails
// //     alert("Unable to detect location. Please enable GPS manually & try again.");
// //     setChecking(false);
// //   };

// //   const handleCheckout = () => {
// //     if (!user) {
// //       alert("Please login before checkout");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     if (deliveryAvailable !== true) {
// //       alert("Please check delivery availability first");
// //       return;
// //     }

// //     navigate("/summary");
// //   };

// //   // ================================================
// //   // 🔥 SAFE TOTAL PRICE (NO NaN EVER)
// //   // ================================================
// //   const totalAmount = cart.reduce((sum, item) => {
// //     let price = item?.price ?? 0;
// //     price = price.toString().replace(/[^\d.]/g, "");
// //     const finalPrice = Number(price);
// //     const qty = Number(item?.qty ?? 0);
// //     return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (isNaN(qty) ? 0 : qty);
// //   }, 0);

// //   return (
// //     <div className="cart-wrapper">
// //       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

// //       <div className="cart-header">
// //         <h2>Your Cart</h2>
// //       </div>

// //       <button
// //         className="checkout-btn"
// //         onClick={handleCheckDelivery}
// //         disabled={checking || deliveryCheckedOnce}
// //         style={{
// //           opacity: deliveryCheckedOnce ? 0.6 : 1,
// //           cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
// //         }}
// //       >
// //         {checking
// //           ? "Checking..."
// //           : deliveryCheckedOnce
// //             ? "Delivery Checked ✔"
// //             : "Check food delivery availability"}
// //       </button>

// //       {deliveryAvailable === true && (
// //         <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
// //           ✔ Food delivery available 🎉 <br />
// //           📍 Distance: {formatDistance(userDistance)}
// //         </p>
// //       )}

// //       {deliveryAvailable === false && (
// //         <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
// //           ❌ Delivery not available (Only within 60 KM) <br />
// //           📍 Distance: {formatDistance(userDistance)}
// //         </p>
// //       )}

// //       {cart.length === 0 ? (
// //         <div className="empty-cart">
// //           <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" />
// //           <h3>Your cart is empty</h3>
// //           <p>Add something tasty!</p>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="cart-list">
// //             {cart.map((item, index) => (
// //               <div className="cart-item" key={index}>
// //                 <img src={item.img} alt="" />
// //                 <div className="item-details">
// //                   <h3>{item.name}</h3>
// //                   <p className="item-option">{item.option}</p>

// //                   <p className="item-price">
// //                     ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
// //                   </p>

// //                   <div className="qty-controls">
// //                     <button onClick={() => decreaseQty(index)}>-</button>
// //                     <span>{item.qty}</span>
// //                     <button onClick={() => increaseQty(index)}>+</button>
// //                   </div>
// //                 </div>

// //                 <button className="remove-item" onClick={() => removeItem(index)}>
// //                   ✖
// //                 </button>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="cart-footer">
// //             <div className="total-row">
// //               <p>Total Amount</p>
// //               <h3>₹{totalAmount}</h3>
// //             </div>

// //             {deliveryAvailable === true && (
// //               <button className="checkout-btn" onClick={handleCheckout}>
// //                 Proceed to Checkout
// //               </button>
// //             )}
// //           </div>
// //         </>
// //       )}

// //       <Footer />
// //     </div>
// //   );
// // }


// // 1 decimber update 

// // import React, { useState } from "react";
// // import "./Cart.css";

// // import { useCart } from "../../context/CartContext";
// // import { useAuth } from "../../context/AuthContext/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // import { NevBar } from "../Heder_Nev/NevBar";
// // import { Footer } from "../Footer/Footer";

// // export function Cart() {
// //   const { cart, increaseQty, decreaseQty, removeItem } = useCart();
// //   const { user, setUser } = useAuth();
// //   const navigate = useNavigate();

// //   const [checking, setChecking] = useState(false);
// //   const [deliveryAvailable, setDeliveryAvailable] = useState(null);
// //   const [userDistance, setUserDistance] = useState(null);
// //   const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

// //   // Restaurant Fixed Location
// //   const restaurantLat = 26.033207;
// //   const restaurantLng = 84.835460;

// //   const toRad = (value) => (value * Math.PI) / 180;

// //   const getDistance = (lat1, lon1, lat2, lon2) => {
// //     const R = 6371;
// //     const dLat = toRad(lat2 - lat1);
// //     const dLon = toRad(lon2 - lon1);

// //     const a =
// //       Math.sin(dLat / 2) ** 2 +
// //       Math.cos(toRad(lat1)) *
// //       Math.cos(toRad(lat2)) *
// //       Math.sin(dLon / 2) ** 2;

// //     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// //   };

// //   const formatDistance = (distance) => {
// //     if (distance * 1000 < 1000) return `${(distance * 1000).toFixed(0)} meters`;
// //     return `${distance.toFixed(2)} KM`;
// //   };

// //   // --------------------------------------------------
// //   // ⭐ FINAL Reliable GPS Function (No errors)
// //   // --------------------------------------------------
// //   const getLocation = () => {
// //     return new Promise((resolve, reject) => {
// //       navigator.geolocation.getCurrentPosition(
// //         (pos) => resolve(pos),
// //         (err) => reject(err),
// //         {
// //           enableHighAccuracy: true,
// //           timeout: 12000,
// //           maximumAge: 0,
// //         }
// //       );
// //     });
// //   };

// //   // --------------------------------------------------
// //   // ⭐ FINAL Delivery Check
// //   // --------------------------------------------------
// //   const handleCheckDelivery = async () => {
// //     if (!user) {
// //       alert("Please login first to check delivery availability");
// //       navigate("/login?redirect=cart");
// //       return;
// //     }

// //     setDeliveryCheckedOnce(true);
// //     setChecking(true);

// //     // 1️⃣ Ask permission if available
// //     try {
// //       if (navigator.permissions) {
// //         const perm = await navigator.permissions.query({ name: "geolocation" });
// //         if (perm.state === "denied") {
// //           alert(
// //             "Please allow location: Chrome → Site Settings → Location → Allow"
// //           );
// //           setChecking(false);
// //           return;
// //         }
// //       }
// //     } catch { }

// //     // 2️⃣ Try GPS (REAL Location)
// //     try {
// //       const pos = await getLocation();
// //       const lat = pos.coords.latitude;
// //       const lng = pos.coords.longitude;

// //       const dist = getDistance(lat, lng, restaurantLat, restaurantLng);
// //       setUserDistance(dist);

// //       setUser({ ...user, lat, lng });

// //       setDeliveryAvailable(dist <= 60);
// //       setChecking(false);
// //       return;
// //     } catch (gpsError) {
// //       console.log("GPS failed:", gpsError);
// //     }

// //     // 3️⃣ Last fallback – NO popup alert now
// //     try {
// //       const fallback = await fetch("https://ipapi.co/json/").then((r) =>
// //         r.json()
// //       );

// //       if (fallback?.latitude) {
// //         const dist = getDistance(
// //           fallback.latitude,
// //           fallback.longitude,
// //           restaurantLat,
// //           restaurantLng
// //         );

// //         setUserDistance(dist);
// //         setDeliveryAvailable(dist <= 60);

// //         setUser({
// //           ...user,
// //           lat: fallback.latitude,
// //           lng: fallback.longitude,
// //         });

// //         setChecking(false);
// //         return;
// //       }
// //     } catch { }

// //     // If nothing works
// //     alert("Unable to detect location. Please turn ON GPS and try again.");
// //     setChecking(false);
// //   };

// //   // --------------------------------------------------
// //   // ⭐ Checkout
// //   // --------------------------------------------------
// //   const handleCheckout = () => {
// //     if (!user) {
// //       alert("Please login before checkout");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     if (deliveryAvailable !== true) {
// //       alert("Please check delivery availability first");
// //       return;
// //     }

// //     navigate("/summary");
// //   };

// //   // --------------------------------------------------
// //   // ⭐ SAFE TOTAL AMOUNT (No NaN Issue)
// //   // --------------------------------------------------
// //   const totalAmount = cart.reduce((sum, item) => {
// //     let price = item?.price ?? 0;

// //     price = price.toString().replace(/[^\d.]/g, "");

// //     const finalPrice = Number(price);
// //     const qty = Number(item?.qty ?? 0);

// //     return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (isNaN(qty) ? 0 : qty);
// //   }, 0);

// //   return (
// //     <div className="cart-wrapper">
// //       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

// //       <div className="cart-header">
// //         <h2>Your Cart</h2>
// //       </div>

// //       <button
// //         className="checkout-btn"
// //         onClick={handleCheckDelivery}
// //         disabled={checking || deliveryCheckedOnce}
// //         style={{
// //           opacity: deliveryCheckedOnce ? 0.6 : 1,
// //           cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
// //         }}
// //       >
// //         {checking
// //           ? "Checking..."
// //           : deliveryCheckedOnce
// //             ? "Delivery Checked ✔"
// //             : "Check food delivery availability"}
// //       </button>

// //       {/* Delivery Status */}
// //       {deliveryAvailable === true && (
// //         <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
// //           ✔ Delivery available 🎉 <br />
// //           📍 Distance: {formatDistance(userDistance)}
// //         </p>
// //       )}

// //       {deliveryAvailable === false && (
// //         <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
// //           ❌ Delivery not available (Only within 60 KM) <br />
// //           📍 Distance: {formatDistance(userDistance)}
// //         </p>
// //       )}

// //       {/* CART EMPTY */}
// //       {cart.length === 0 ? (
// //         <div className="empty-cart">
// //           <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" />
// //           <h3>Your cart is empty</h3>
// //           <p>Add something tasty!</p>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="cart-list">
// //             {cart.map((item, index) => (
// //               <div className="cart-item" key={index}>
// //                 <img src={item.img} alt="" />

// //                 <div className="item-details">
// //                   <h3>{item.name}</h3>
// //                   <p className="item-option">{item.option}</p>

// //                   <p className="item-price">
// //                     ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
// //                   </p>

// //                   <div className="qty-controls">
// //                     <button onClick={() => decreaseQty(index)}>-</button>
// //                     <span>{item.qty}</span>
// //                     <button onClick={() => increaseQty(index)}>+</button>
// //                   </div>
// //                 </div>

// //                 <button
// //                   className="remove-item"
// //                   onClick={() => removeItem(index)}
// //                 >
// //                   ✖
// //                 </button>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="cart-footer">
// //             <div className="total-row">
// //               <p>Total Amount</p>
// //               <h3>₹{totalAmount}</h3>
// //             </div>

// //             {deliveryAvailable === true && (
// //               <button className="checkout-btn" onClick={handleCheckout}>
// //                 Proceed to Checkout
// //               </button>
// //             )}
// //           </div>
// //         </>
// //       )}

// //       <Footer />
// //     </div>
// //   );
// // }


// import React, { useState } from "react";
// import "./Cart.css";

// import { useCart } from "../../context/CartContext";
// import { useAuth } from "../../context/AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";

// import { NevBar } from "../Heder_Nev/NevBar";
// import { Footer } from "../Footer/Footer";

// /**
//  * Robust location approach:
//  * 1) watchPosition collecting fixes (prefer <= desiredAccuracy meters)
//  * 2) timeout (maxWait) then use best collected fix
//  * 3) optional Google Geolocation API fallback if provided (REACT_APP_GOOGLE_GEO_API_KEY)
//  * 4) final fallback: IP-based (ipapi)
//  *
//  * Notes:
//  * - Add REACT_APP_GOOGLE_GEO_API_KEY to .env to enable Google fallback (optional).
//  * - desiredAccuracy and maxWait can be tuned.
//  */

// export function Cart() {
//   const { cart, increaseQty, decreaseQty, removeItem } = useCart();
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const [checking, setChecking] = useState(false);
//   const [deliveryAvailable, setDeliveryAvailable] = useState(null);
//   const [userDistance, setUserDistance] = useState(null);
//   const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);
//   const [hint, setHint] = useState(""); // small non-blocking hint if accuracy low

//   const restaurantLat = 26.033207;
//   const restaurantLng = 84.835460;

//   const toRad = (v) => (v * Math.PI) / 180;
//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//     return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
//   };

//   const formatDistance = (d) =>
//     d == null ? "--" : d * 1000 < 1000 ? `${(d * 1000).toFixed(0)} meters` : `${d.toFixed(2)} KM`;

//   // -------------------------
//   // watchPosition collector
//   // -------------------------
//   const collectFixes = ({ desiredAccuracy = 40, maxWait = 20000 } = {}) => {
//     return new Promise((resolve, reject) => {
//       if (!("geolocation" in navigator)) {
//         reject(new Error("Geolocation not supported"));
//         return;
//       }

//       let best = null;
//       let watcher = null;
//       let finished = false;

//       const finish = (pos) => {
//         if (finished) return;
//         finished = true;
//         if (watcher) navigator.geolocation.clearWatch(watcher);
//         resolve(pos);
//       };

//       const abort = (err) => {
//         if (finished) return;
//         finished = true;
//         if (watcher) navigator.geolocation.clearWatch(watcher);
//         reject(err);
//       };

//       // overall timeout
//       const timer = setTimeout(() => {
//         if (best) finish(best);
//         else abort(new Error("timeout"));
//       }, maxWait);

//       try {
//         watcher = navigator.geolocation.watchPosition(
//           (pos) => {
//             const acc = pos.coords && pos.coords.accuracy ? pos.coords.accuracy : Infinity;
//             // pick best (lowest accuracy)
//             if (!best || acc < (best.coords?.accuracy ?? Infinity)) {
//               best = pos;
//             }
//             // if this fix is good enough, finish early
//             if (acc <= desiredAccuracy) {
//               clearTimeout(timer);
//               finish(pos);
//             } else {
//               // update non-blocking hint for the user to move near a window
//               setHint(`Weak GPS — accuracy ${Math.round(acc)}m. Move to open area for better result.`);
//             }
//           },
//           (err) => {
//             clearTimeout(timer);
//             abort(err);
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 10000, // per-call - watch continues
//           }
//         );
//       } catch (e) {
//         clearTimeout(timer);
//         abort(e);
//       }
//     });
//   };

//   // -------------------------
//   // Google Geolocation API fallback (optional)
//   // -------------------------
//   const googleGeolocate = async () => {
//     const key = process.env.REACT_APP_GOOGLE_GEO_API_KEY;
//     if (!key) return null;

//     // Use the simple "considerIp" request to Google Geolocation API.
//     // For better results you can send WifiAccessPoints / cellTowers (requires permissions).
//     try {
//       const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${key}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ considerIp: true }),
//       });
//       if (!res.ok) throw new Error("Google geolocation failed");
//       const data = await res.json();
//       if (data && data.location) {
//         return { lat: data.location.lat, lng: data.location.lng, accuracy: data.accuracy || null };
//       }
//     } catch (e) {
//       console.warn("Google geolocation error", e);
//     }
//     return null;
//   };

//   // -------------------------
//   // Main handler used by UI
//   // -------------------------
//   const handleCheckDelivery = async () => {
//     if (!user) {
//       alert("Please login first to check delivery availability");
//       navigate("/login?redirect=cart");
//       return;
//     }

//     setChecking(true);
//     setHint("");
//     setDeliveryCheckedOnce(true);

//     // quick permission check (non-blocking)
//     try {
//       if (navigator.permissions) {
//         const p = await navigator.permissions.query({ name: "geolocation" });
//         if (p.state === "denied") {
//           alert("Please enable Location for this site in Chrome → Site Settings → Location → Allow");
//           setChecking(false);
//           return;
//         }
//       }
//     } catch { }

//     let lat = null;
//     let lng = null;
//     let usedSource = "gps";

//     // 1) Try to collect good GPS fix
//     try {
//       const pos = await collectFixes({ desiredAccuracy: 40, maxWait: 20000 });
//       if (pos?.coords) {
//         lat = pos.coords.latitude;
//         lng = pos.coords.longitude;
//         const acc = pos.coords.accuracy;
//         if (acc && acc > 100) {
//           // very coarse. We'll attempt Google fallback below if present
//           setHint(`GPS accuracy low (${Math.round(acc)}m). Trying network-assisted fallback...`);
//         }
//       }
//     } catch (err) {
//       console.log("collectFixes failed:", err);
//     }

//     // 2) If no good GPS, try Google fallback (optional)
//     if ((!lat || !lng) && process.env.REACT_APP_GOOGLE_GEO_API_KEY) {
//       try {
//         const g = await googleGeolocate();
//         if (g) {
//           lat = g.lat;
//           lng = g.lng;
//           usedSource = "google";
//           setHint(""); // Google returned a location; clear hint
//         }
//       } catch (e) {
//         console.log("google fallback failed", e);
//       }
//     }

//     // 3) Final fallback: ipapi (coarse)
//     if ((!lat || !lng)) {
//       try {
//         const fallback = await fetch("https://ipapi.co/json/").then((r) => r.json());
//         if (fallback?.latitude && fallback?.longitude) {
//           lat = fallback.latitude;
//           lng = fallback.longitude;
//           usedSource = "ip";
//           setHint("Using approximate location from network (coarse).");
//         }
//       } catch (e) {
//         console.warn("ipapi failed", e);
//       }
//     }

//     if (!lat || !lng) {
//       alert("Unable to determine your location. Please enable GPS and try again.");
//       setChecking(false);
//       return;
//     }

//     const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
//     setUserDistance(distance);
//     setDeliveryAvailable(distance <= 60);

//     // persist user's coords in auth context (if available)
//     setUser && setUser({ ...user, lat, lng, locationSource: usedSource });

//     setChecking(false);
//   };

//   // SAFE total calc
//   const totalAmount = cart.reduce((sum, item) => {
//     let price = item?.price ?? 0;
//     price = String(price).replace(/[^\d.]/g, "");
//     const p = Number(price);
//     const q = Number(item?.qty ?? 0);
//     return sum + (isNaN(p) ? 0 : p) * (isNaN(q) ? 0 : q);
//   }, 0);

//   const handleCheckout = () => {
//     if (!user) {
//       alert("Please login before checkout");
//       navigate("/login?redirect=summary");
//       return;
//     }
//     if (!deliveryAvailable) {
//       alert("Please check delivery availability first");
//       return;
//     }
//     navigate("/summary");
//   };

//   return (
//     <div className="cart-wrapper">
//       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

//       <div className="cart-header"><h2>Your Cart</h2></div>

//       <button
//         className="checkout-btn"
//         onClick={handleCheckDelivery}
//         disabled={checking || deliveryCheckedOnce}
//         style={{ opacity: deliveryCheckedOnce ? 0.6 : 1, cursor: deliveryCheckedOnce ? "not-allowed" : "pointer" }}
//       >
//         {checking ? "Checking..." : deliveryCheckedOnce ? "Delivery Checked ✔" : "Check food delivery availability"}
//       </button>

//       {/* non-blocking hint shown to user (not alert) */}
//       {hint && <p style={{ textAlign: "center", color: "#b04", marginTop: 8 }}>{hint}</p>}

//       {deliveryAvailable === true && (
//         <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
//           ✔ Delivery available 🎉 <br />📍 Distance: {formatDistance(userDistance)}
//         </p>
//       )}
//       {deliveryAvailable === false && (
//         <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
//           ❌ Delivery not available (Only within 60 KM) <br />📍 Distance: {formatDistance(userDistance)}
//         </p>
//       )}

//       {cart.length === 0 ? (
//         <div className="empty-cart">
//           <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" alt="empty" />
//           <h3>Your cart is empty</h3>
//           <p>Add something tasty!</p>
//         </div>
//       ) : (
//         <>
//           <div className="cart-list">
//             {cart.map((item, idx) => (
//               <div className="cart-item" key={idx}>
//                 <img src={item.img} alt={item.name} />
//                 <div className="item-details">
//                   <h3>{item.name}</h3>
//                   <p className="item-option">{item.option}</p>
//                   <p className="item-price">₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}</p>
//                   <div className="qty-controls">
//                     <button onClick={() => decreaseQty(idx)}>-</button>
//                     <span>{item.qty}</span>
//                     <button onClick={() => increaseQty(idx)}>+</button>
//                   </div>
//                 </div>
//                 <button className="remove-item" onClick={() => removeItem(idx)}>✖</button>
//               </div>
//             ))}
//           </div>

//           <div className="cart-footer">
//             <div className="total-row">
//               <p>Total Amount</p>
//               <h3>₹{totalAmount}</h3>
//             </div>

//             {deliveryAvailable === true && (
//               <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
//             )}
//           </div>
//         </>
//       )}

//       <Footer />
//     </div>
//   );
// }



import React, { useState } from "react";
import "./Cart.css";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

import { NevBar } from "../Heder_Nev/NevBar";
import { Footer } from "../Footer/Footer";

/**
 * Optimized Location Strategy - Single Request
 * - Uses getCurrentPosition ONCE with optimized settings
 * - No multiple retries or watchPosition to avoid repeated permission prompts
 * - Falls back to IP-based location if GPS fails
 * - Works reliably on iOS, Android, and Desktop browsers
 */

export function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [userDistance, setUserDistance] = useState(null);
  const [deliveryCheckedOnce, setDeliveryCheckedOnce] = useState(false);

  const restaurantLat = 26.033207;
  const restaurantLng = 84.835460;

  const toRad = (v) => (v * Math.PI) / 180;

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const formatDistance = (d) =>
    d == null ? "--" : d * 1000 < 1000 ? `${(d * 1000).toFixed(0)} meters` : `${d.toFixed(2)} KM`;

  /**
   * Single GPS request - no retries, no watchPosition
   * This prevents multiple permission prompts
   */
  const getGPSLocation = () => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleCheckDelivery = async () => {
    if (!user) {
      alert("Please login first to check delivery availability");
      navigate("/login?redirect=cart");
      return;
    }

    setChecking(true);
    setDeliveryCheckedOnce(true);

    // Check permission status first
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") {
          alert("Location access is blocked. Please enable it in your browser settings:\n\nChrome: Settings → Privacy → Location → Allow");
          setChecking(false);
          return;
        }
      }
    } catch (e) {
      // Permission API not supported, continue anyway
    }

    let lat = null;
    let lng = null;
    let locationSource = "gps";

    // Try GPS location (single request)
    try {
      const gpsData = await getGPSLocation();
      lat = gpsData.lat;
      lng = gpsData.lng;

      // Log accuracy for debugging
      console.log(`GPS accuracy: ${Math.round(gpsData.accuracy)} meters`);
    } catch (gpsError) {
      console.log("GPS failed:", gpsError.message);
      locationSource = "ip";
    }

    // Fallback to IP-based location if GPS failed
    if (!lat || !lng) {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const ipData = await response.json();

        if (ipData?.latitude && ipData?.longitude) {
          lat = ipData.latitude;
          lng = ipData.longitude;
          console.log("Using IP-based location (approximate)");
        }
      } catch (ipError) {
        console.log("IP location failed:", ipError);
      }
    }

    // If both methods failed
    if (!lat || !lng) {
      alert("Unable to detect your location. Please:\n1. Enable GPS/Location services\n2. Allow location access in browser\n3. Try again");
      setChecking(false);
      setDeliveryCheckedOnce(false);
      return;
    }

    // Calculate distance
    const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
    setUserDistance(distance);
    setDeliveryAvailable(distance <= 60);

    // Save coordinates to user context
    if (setUser) {
      setUser({ ...user, lat, lng, locationSource });
    }

    setChecking(false);
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
    let price = item?.price ?? 0;
    price = String(price).replace(/[^\d.]/g, "");
    const p = Number(price);
    const q = Number(item?.qty ?? 0);
    return sum + (isNaN(p) ? 0 : p) * (isNaN(q) ? 0 : q);
  }, 0);

  return (
    <div className="cart-wrapper">
      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

      <div className="cart-header">
        <h2>Your Cart</h2>
      </div>

      <button
        className="checkout-btn"
        onClick={handleCheckDelivery}
        disabled={checking || deliveryCheckedOnce}
        style={{
          opacity: deliveryCheckedOnce ? 0.6 : 1,
          cursor: deliveryCheckedOnce ? "not-allowed" : "pointer",
        }}
      >
        {checking ? "Checking..." : deliveryCheckedOnce ? "Delivery Checked ✔" : "Check food delivery availability"}
      </button>

      {deliveryAvailable === true && (
        <p style={{ color: "green", textAlign: "center", marginTop: 6 }}>
          ✔ Delivery available 🎉 <br />
          📍 Distance: {formatDistance(userDistance)}
        </p>
      )}

      {deliveryAvailable === false && (
        <p style={{ color: "red", textAlign: "center", marginTop: 6 }}>
          ❌ Delivery not available (Only within 60 KM) <br />
          📍 Distance: {formatDistance(userDistance)}
        </p>
      )}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/2037/2037454.png" alt="empty" />
          <h3>Your cart is empty</h3>
          <p>Add something tasty!</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item, idx) => (
              <div className="cart-item" key={idx}>
                <img src={item.img} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-option">{item.option}</p>
                  <p className="item-price">₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}</p>
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(idx)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(idx)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeItem(idx)}>✖</button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="total-row">
              <p>Total Amount</p>
              <h3>₹{totalAmount}</h3>
            </div>

            {deliveryAvailable === true && (
              <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
