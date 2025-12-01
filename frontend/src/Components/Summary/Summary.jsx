
// // import React, { useState } from "react";
// // import "./Summary.css";
// // import { useCart } from "../../context/CartContext";
// // import { useAuth } from "../../context/AuthContext/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // import { NevBar } from "../Heder_Nev/NevBar.jsx";
// // import { Footer } from "../Footer/Footer.jsx";

// // export function Summary() {
// //   const { cart } = useCart();
// //   const { user, setUser } = useAuth();
// //   const navigate = useNavigate();

// //   const [checking, setChecking] = useState(false);
// //   const [deliveryAvailable, setDeliveryAvailable] = useState(false);
// //   const [userDistance, setUserDistance] = useState(null);
// //   const [userAddress, setUserAddress] = useState("");
// //   const [manualEntry, setManualEntry] = useState(false);
// //   const [locationChecked, setLocationChecked] = useState(false);

// //   // Restaurant Coordinates
// //   const restaurantLat = 26.033197;
// //   const restaurantLng = 84.835471;

// //   const toRad = (v) => (v * Math.PI) / 180;

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

// //   const formatDistance = (d) =>
// //     d * 1000 < 1000 ? `${(d * 1000).toFixed(0)} meters` : `${d.toFixed(2)} KM`;

// //   const isInstagramBrowser = () =>
// //     navigator.userAgent.includes("Instagram");

// //   // =======================================================
// //   // 🔥 HIGH-ACCURACY GPS (Same as Cart.jsx)
// //   // =======================================================
// //   const getPreciseLocation = () => {
// //     return new Promise((resolve, reject) => {
// //       let timeoutReached = false;

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

// //   // =======================================================
// //   // 📍 LOCATION DETECTION
// //   // =======================================================
// //   const handleGetLocation = async () => {
// //     if (!user) {
// //       alert("Please login first");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     if (isInstagramBrowser()) {
// //       alert("Location blocked inside Instagram browser. Please open in Chrome.");
// //       return;
// //     }

// //     setChecking(true);

// //     // Check Permissions
// //     try {
// //       if (navigator.permissions) {
// //         const perm = await navigator.permissions.query({ name: "geolocation" });
// //         if (perm.state === "denied") {
// //           alert("Enable location: Chrome → Site Settings → Location → Allow");
// //           setChecking(false);
// //           return;
// //         }
// //       }
// //     } catch { }

// //     // 1️⃣ Try precise GPS
// //     try {
// //       const gps = await getPreciseLocation();

// //       if (gps.accuracy > 50) {
// //         alert(
// //           "Weak GPS signal. Move near a window or in open area for better accuracy."
// //         );
// //       }

// //       const distance = getDistance(
// //         gps.lat,
// //         gps.lng,
// //         restaurantLat,
// //         restaurantLng
// //       );

// //       setUserDistance(distance);
// //       setDeliveryAvailable(true);
// //       setLocationChecked(true);

// //       setUser({ ...user, lat: gps.lat, lng: gps.lng });

// //       // Reverse Geocoding
// //       try {
// //         const res = await fetch(
// //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gps.lat}&lon=${gps.lng}`
// //         );
// //         const data = await res.json();

// //         if (data?.display_name) {
// //           setUserAddress(data.display_name);
// //         } else {
// //           setManualEntry(true);
// //         }
// //       } catch {
// //         setManualEntry(true);
// //       }

// //       setChecking(false);
// //       return;
// //     } catch (err) {
// //       console.log("GPS failed:", err);
// //     }

// //     // 2️⃣ Fallback: IP Approximate Location
// //     try {
// //       const fallback = await fetch("https://ipapi.co/json/").then((r) =>
// //         r.json()
// //       );

// //       if (fallback?.latitude) {
// //         const distance = getDistance(
// //           fallback.latitude,
// //           fallback.longitude,
// //           restaurantLat,
// //           restaurantLng
// //         );

// //         setUserDistance(distance);
// //         setDeliveryAvailable(true);
// //         setLocationChecked(true);

// //         setUser({
// //           ...user,
// //           lat: fallback.latitude,
// //           lng: fallback.longitude,
// //         });

// //         setUserAddress(
// //           `${fallback.city}, ${fallback.region}, ${fallback.country_name}`
// //         );

// //         alert(
// //           "Precise GPS unavailable — using approximate location based on your network."
// //         );
// //         setChecking(false);
// //         return;
// //       }
// //     } catch { }

// //     alert("Unable to detect location. Please enable GPS manually.");
// //     setChecking(false);
// //     setManualEntry(true);
// //   };

// //   // =======================================================
// //   // 💰 SAFE PRICE CALCULATION
// //   // =======================================================
// //   const totalAmount = cart.reduce((sum, item) => {
// //     let price = item?.price ?? 0;
// //     price = price.toString().replace(/[^\d.]/g, "");
// //     const finalPrice = Number(price);
// //     return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (item.qty ?? 0);
// //   }, 0);

// //   const deliveryCharge = totalAmount >= 499 ? 0 : 40;
// //   const grandTotal = totalAmount + deliveryCharge;

// //   const handlePayment = () => {
// //     if (!user) {
// //       alert("Please login to continue");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     if (!userAddress) {
// //       alert("Please provide your full address.");
// //       return;
// //     }

// //     localStorage.setItem(
// //       "apnaSwad_delivery_info",
// //       JSON.stringify({
// //         fullAddress: userAddress,
// //         phone: user?.phone || "",
// //         coords: user?.lat ? { lat: user.lat, lng: user.lng } : null,
// //         distance: userDistance,
// //       })
// //     );

// //     navigate("/payment");
// //   };

// //   return (
// //     <div className="summary-container">
// //       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

// //       {/* Address Section */}
// //       <div className="address-section">
// //         <h3>Delivery Location</h3>

// //         <button
// //           className="change-address-btn"
// //           onClick={handleGetLocation}
// //           disabled={checking || locationChecked}
// //         >
// //           {checking ? "Checking..." : "Click to Auto Detect Location"}
// //         </button>

// //         {deliveryAvailable && (
// //           <p style={{ color: "green", marginTop: 10 }}>
// //             ✔ Delivery available<br />
// //             📍 Distance: {formatDistance(userDistance)}<br /><br />
// //             <b>Your address:</b><br />
// //             {userAddress}
// //           </p>
// //         )}

// //         {manualEntry && (
// //           <div style={{ marginTop: 20 }}>
// //             <label><b>Enter Address Manually:</b></label>
// //             <textarea
// //               className="manual-address-box"
// //               placeholder="Type your full address here..."
// //               value={userAddress}
// //               onChange={(e) => setUserAddress(e.target.value)}
// //             />
// //           </div>
// //         )}
// //       </div>

// //       {/* Items Section */}
// //       <div className="items-section">
// //         <h3>Order Summary</h3>

// //         {cart.map((item, idx) => (
// //           <div className="summary-item" key={idx}>
// //             <img src={item.img} alt={item.name} />

// //             <div>
// //               <p className="item-name">{item.name}</p>
// //               <p className="item-option">{item.option}</p>
// //               <p>Qty: {item.qty}</p>
// //             </div>

// //             <p className="item-price">
// //               ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Price Section */}
// //       <div className="price-section">
// //         <h3>Price Details</h3>

// //         <div className="price-row">
// //           <p>Subtotal</p>
// //           <p>₹{totalAmount}</p>
// //         </div>

// //         <div className="price-row">
// //           <p>Delivery Charges</p>
// //           <p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p>
// //         </div>

// //         <div className="price-total">
// //           <strong>Total Amount</strong>
// //           <strong>₹{grandTotal}</strong>
// //         </div>

// //         {locationChecked && (
// //           <button className="payment-btn" onClick={handlePayment}>
// //             Proceed to Payment
// //           </button>
// //         )}
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // }


// // 1 decimber update code

// // import React, { useState } from "react";
// // import "./Summary.css";
// // import { useCart } from "../../context/CartContext";
// // import { useAuth } from "../../context/AuthContext/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // import { NevBar } from "../Heder_Nev/NevBar.jsx";
// // import { Footer } from "../Footer/Footer.jsx";

// // export function Summary() {
// //   const { cart } = useCart();
// //   const { user, setUser } = useAuth();
// //   const navigate = useNavigate();

// //   const [checking, setChecking] = useState(false);
// //   const [deliveryAvailable, setDeliveryAvailable] = useState(false);
// //   const [userDistance, setUserDistance] = useState(null);
// //   const [userAddress, setUserAddress] = useState("");
// //   const [manualEntry, setManualEntry] = useState(false);

// //   const [locationChecked, setLocationChecked] = useState(false);

// //   // Restaurant Fixed Location
// //   const restaurantLat = 26.033197;
// //   const restaurantLng = 84.835471;

// //   const toRad = (v) => (v * Math.PI) / 180;

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

// //   const formatDistance = (d) => {
// //     if (d * 1000 < 1000) return `${(d * 1000).toFixed(0)} meters`;
// //     return `${d.toFixed(2)} KM`;
// //   };

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
// //   // ⭐ FINAL AUTO LOCATION DETECTION
// //   // --------------------------------------------------
// //   const handleGetLocation = async () => {
// //     if (!user) {
// //       alert("Please login first");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     setChecking(true);

// //     // 1️⃣ Check permission status first
// //     try {
// //       if (navigator.permissions) {
// //         const perm = await navigator.permissions.query({ name: "geolocation" });
// //         if (perm.state === "denied") {
// //           alert("Enable location: Chrome → Site Settings → Location → Allow");
// //           setChecking(false);
// //           return;
// //         }
// //       }
// //     } catch { }

// //     // 2️⃣ Try REAL GPS first
// //     try {
// //       const pos = await getLocation();

// //       const lat = pos.coords.latitude;
// //       const lng = pos.coords.longitude;

// //       const distance = getDistance(lat, lng, restaurantLat, restaurantLng);

// //       setUserDistance(distance);
// //       setDeliveryAvailable(true);
// //       setLocationChecked(true);

// //       setUser({ ...user, lat, lng });

// //       // Fetch human-readable address
// //       try {
// //         const res = await fetch(
// //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
// //         );
// //         const data = await res.json();

// //         if (data?.display_name) setUserAddress(data.display_name);
// //         else setManualEntry(true);
// //       } catch {
// //         setManualEntry(true);
// //       }

// //       setChecking(false);
// //       return;
// //     } catch (error) {
// //       console.log("GPS failed → fallback", error);
// //     }

// //     // 3️⃣ Last fallback (NO ALERT)
// //     try {
// //       const fallback = await fetch("https://ipapi.co/json/").then((r) =>
// //         r.json()
// //       );

// //       if (fallback?.latitude) {
// //         const lat = fallback.latitude;
// //         const lng = fallback.longitude;

// //         const distance = getDistance(lat, lng, restaurantLat, restaurantLng);

// //         setUserDistance(distance);
// //         setDeliveryAvailable(true);
// //         setLocationChecked(true);

// //         setUser({ ...user, lat, lng });

// //         setUserAddress(
// //           `${fallback.city}, ${fallback.region}, ${fallback.country_name}`
// //         );

// //         setChecking(false);
// //         return;
// //       }
// //     } catch { }

// //     // 4️⃣ If nothing works
// //     alert("Unable to detect your location. Please turn ON GPS.");
// //     setChecking(false);
// //     setManualEntry(true);
// //   };

// //   // --------------------------------------------------
// //   // ⭐ SAFE TOTAL CALCULATION (NO replace error)
// //   // --------------------------------------------------
// //   const totalAmount = cart.reduce((sum, item) => {
// //     let price = item?.price ?? 0;
// //     price = price.toString().replace(/[^\d.]/g, "");
// //     const finalPrice = Number(price);

// //     return sum + (isNaN(finalPrice) ? 0 : finalPrice) * (item.qty ?? 0);
// //   }, 0);

// //   const deliveryCharge = totalAmount >= 499 ? 0 : 40;
// //   const grandTotal = totalAmount + deliveryCharge;

// //   const handlePayment = () => {
// //     if (!user) {
// //       alert("Please login to continue");
// //       navigate("/login?redirect=summary");
// //       return;
// //     }

// //     if (!userAddress) {
// //       alert("Please provide your address.");
// //       return;
// //     }

// //     // Save data for Payment page
// //     localStorage.setItem(
// //       "apnaSwad_delivery_info",
// //       JSON.stringify({
// //         fullAddress: userAddress,
// //         phone: user?.phone || "",
// //         coords: user?.lat ? { lat: user.lat, lng: user.lng } : null,
// //         distance: userDistance,
// //       })
// //     );

// //     navigate("/payment");
// //   };

// //   return (
// //     <div className="summary-container">
// //       <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />

// //       {/* Address Section */}
// //       <div className="address-section">
// //         <h3>Delivery Location</h3>

// //         <button
// //           className="change-address-btn"
// //           onClick={handleGetLocation}
// //           disabled={checking || locationChecked}
// //         >
// //           {checking ? "Checking..." : "Click to Auto Detect Location"}
// //         </button>

// //         {deliveryAvailable && (
// //           <p style={{ color: "green", marginTop: 10 }}>
// //             ✔ Delivery available <br />
// //             📍 Distance: {formatDistance(userDistance)} <br />
// //             <br />
// //             📌 <b>Your address:</b> <br />
// //             {userAddress}
// //           </p>
// //         )}

// //         {manualEntry && (
// //           <div style={{ marginTop: 20 }}>
// //             <label>
// //               <b>Enter Address Manually:</b>
// //             </label>
// //             <textarea
// //               className="manual-address-box"
// //               placeholder="Type your full address here..."
// //               value={userAddress}
// //               onChange={(e) => setUserAddress(e.target.value)}
// //             />
// //           </div>
// //         )}
// //       </div>

// //       {/* Items Section */}
// //       <div className="items-section">
// //         <h3>Order Summary</h3>

// //         {cart.map((item, idx) => (
// //           <div className="summary-item" key={idx}>
// //             <img src={item.img} alt={item.name} />

// //             <div>
// //               <p className="item-name">{item.name}</p>
// //               <p className="item-option">{item.option}</p>
// //               <p>Qty: {item.qty}</p>
// //             </div>

// //             <p className="item-price">
// //               ₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Price Section */}
// //       <div className="price-section">
// //         <h3>Price Details</h3>

// //         <div className="price-row">
// //           <p>Subtotal</p>
// //           <p>₹{totalAmount}</p>
// //         </div>

// //         <div className="price-row">
// //           <p>Delivery Charges</p>
// //           <p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p>
// //         </div>

// //         <div className="price-total">
// //           <strong>Total Amount</strong>
// //           <strong>₹{grandTotal}</strong>
// //         </div>

// //         {locationChecked && (
// //           <button className="payment-btn" onClick={handlePayment}>
// //             Proceed to Payment
// //           </button>
// //         )}
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // }





// import React, { useState } from "react";
// import "./Summary.css";
// import { useCart } from "../../context/CartContext";
// import { useAuth } from "../../context/AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";

// import { NevBar } from "../Heder_Nev/NevBar.jsx";
// import { Footer } from "../Footer/Footer.jsx";

// /**
//  * Same robust location engine used for Summary page.
//  * It will:
//  *  - try to gather good GPS fix with watchPosition
//  *  - optional Google Geolocation fallback if you set REACT_APP_GOOGLE_GEO_API_KEY
//  *  - final fallback to ipapi
//  */

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
//   const [hint, setHint] = useState("");

//   const restaurantLat = 26.033197;
//   const restaurantLng = 84.835471;

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

//   // collector (same as Cart)
//   const collectFixes = ({ desiredAccuracy = 40, maxWait = 20000 } = {}) =>
//     new Promise((resolve, reject) => {
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
//       const timer = setTimeout(() => {
//         if (best) finish(best);
//         else abort(new Error("timeout"));
//       }, maxWait);
//       try {
//         watcher = navigator.geolocation.watchPosition(
//           (pos) => {
//             const acc = pos.coords?.accuracy ?? Infinity;
//             if (!best || acc < (best.coords?.accuracy ?? Infinity)) best = pos;
//             if (acc <= desiredAccuracy) {
//               clearTimeout(timer);
//               finish(pos);
//             } else {
//               setHint(`Weak GPS — accuracy ${Math.round(acc)}m. Move near a window for better results.`);
//             }
//           },
//           (err) => {
//             clearTimeout(timer);
//             abort(err);
//           },
//           { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//         );
//       } catch (e) {
//         clearTimeout(timer);
//         abort(e);
//       }
//     });

//   const googleGeolocate = async () => {
//     const key = process.env.REACT_APP_GOOGLE_GEO_API_KEY;
//     if (!key) return null;
//     try {
//       const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${key}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ considerIp: true }),
//       });
//       if (!res.ok) throw new Error("Google geolocate failed");
//       const data = await res.json();
//       if (data?.location) return { lat: data.location.lat, lng: data.location.lng, accuracy: data.accuracy ?? null };
//     } catch (e) {
//       console.warn("google geolocate error", e);
//     }
//     return null;
//   };

//   const handleGetLocation = async () => {
//     if (!user) {
//       alert("Please login first");
//       navigate("/login?redirect=summary");
//       return;
//     }

//     setChecking(true);
//     setHint("");

//     try {
//       if (navigator.permissions) {
//         const p = await navigator.permissions.query({ name: "geolocation" });
//         if (p.state === "denied") {
//           alert("Enable location for this site in Chrome → Site Settings → Location → Allow");
//           setChecking(false);
//           return;
//         }
//       }
//     } catch { }

//     let lat = null;
//     let lng = null;
//     let pos = null;
//     try {
//       pos = await collectFixes({ desiredAccuracy: 40, maxWait: 20000 });
//       if (pos?.coords) {
//         lat = pos.coords.latitude;
//         lng = pos.coords.longitude;
//       }
//     } catch (e) {
//       console.log("GPS collect failed", e);
//     }

//     // try Google fallback
//     if ((!lat || !lng) && process.env.REACT_APP_GOOGLE_GEO_API_KEY) {
//       const g = await googleGeolocate();
//       if (g) {
//         lat = g.lat;
//         lng = g.lng;
//         setHint("");
//       }
//     }

//     // last fallback ip
//     if ((!lat || !lng)) {
//       try {
//         const fallback = await fetch("https://ipapi.co/json/").then((r) => r.json());
//         if (fallback?.latitude && fallback?.longitude) {
//           lat = fallback.latitude;
//           lng = fallback.longitude;
//           setUserAddress(`${fallback.city}, ${fallback.region}, ${fallback.country_name}`);
//           setHint("Using approximate location from network.");
//         }
//       } catch (e) {
//         console.warn("ipapi failed", e);
//       }
//     }

//     if (!lat || !lng) {
//       alert("Unable to detect location. Please enable GPS and try again.");
//       setManualEntry(true);
//       setChecking(false);
//       return;
//     }

//     const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
//     setUserDistance(distance);
//     setDeliveryAvailable(true);
//     setLocationChecked(true);
//     setUser({ ...user, lat, lng });

//     // if we had a gps pos, reverse geocode; otherwise address already set via ip fallback
//     if (pos?.coords) {
//       try {
//         const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
//         const data = await res.json();
//         if (data?.display_name) setUserAddress(data.display_name);
//         else setManualEntry(true);
//       } catch {
//         setManualEntry(true);
//       }
//     }

//     setChecking(false);
//   };

//   // price calc safe
//   const totalAmount = cart.reduce((sum, item) => {
//     let price = item?.price ?? 0;
//     price = String(price).replace(/[^\d.]/g, "");
//     const p = Number(price);
//     return sum + (isNaN(p) ? 0 : p) * (item.qty ?? 0);
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
//       alert("Please provide your address.");
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

//       <div className="address-section">
//         <h3>Delivery Location</h3>

//         <button className="change-address-btn" onClick={handleGetLocation} disabled={checking || locationChecked}>
//           {checking ? "Checking..." : "Click to Auto Detect Location"}
//         </button>

//         {hint && <p style={{ color: "#b04", marginTop: 8 }}>{hint}</p>}

//         {deliveryAvailable && (
//           <p style={{ color: "green", marginTop: 10 }}>
//             ✔ Delivery available<br />
//             📍 Distance: {formatDistance(userDistance)}<br /><br />
//             <b>Your address:</b><br />
//             {userAddress}
//           </p>
//         )}

//         {manualEntry && (
//           <div style={{ marginTop: 20 }}>
//             <label><b>Enter Address Manually:</b></label>
//             <textarea className="manual-address-box" placeholder="Type your address..." value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
//           </div>
//         )}
//       </div>

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
//             <p className="item-price">₹{String(item.price ?? 0).replace(/[^\d.]/g, "")}</p>
//           </div>
//         ))}
//       </div>

//       <div className="price-section">
//         <h3>Price Details</h3>
//         <div className="price-row"><p>Subtotal</p><p>₹{totalAmount}</p></div>
//         <div className="price-row"><p>Delivery Charges</p><p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p></div>
//         <div className="price-total"><strong>Total Amount</strong><strong>₹{grandTotal}</strong></div>

//         {locationChecked && <button className="payment-btn" onClick={handlePayment}>Proceed to Payment</button>}
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

/**
 * Optimized Location Strategy - Single Request
 * - Uses getCurrentPosition ONCE with optimized settings
 * - No multiple retries or watchPosition to avoid repeated permission prompts
 * - Falls back to IP-based location if GPS fails
 * - Works reliably on iOS, Android, and Desktop browsers
 */

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

  const handleGetLocation = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login?redirect=summary");
      return;
    }

    setChecking(true);

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
    let gpsSuccess = false;

    // Try GPS location (single request)
    try {
      const gpsData = await getGPSLocation();
      lat = gpsData.lat;
      lng = gpsData.lng;
      gpsSuccess = true;

      // Log accuracy for debugging
      console.log(`GPS accuracy: ${Math.round(gpsData.accuracy)} meters`);
    } catch (gpsError) {
      console.log("GPS failed:", gpsError.message);
    }

    // Fallback to IP-based location if GPS failed
    if (!lat || !lng) {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const ipData = await response.json();

        if (ipData?.latitude && ipData?.longitude) {
          lat = ipData.latitude;
          lng = ipData.longitude;
          setUserAddress(`${ipData.city}, ${ipData.region}, ${ipData.country_name}`);
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
      setManualEntry(true);
      return;
    }

    // Calculate distance
    const distance = getDistance(lat, lng, restaurantLat, restaurantLng);
    setUserDistance(distance);
    setDeliveryAvailable(true);
    setLocationChecked(true);

    // Save coordinates to user context
    if (setUser) {
      setUser({ ...user, lat, lng });
    }

    // Reverse geocode only if we got GPS location
    if (gpsSuccess) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data?.display_name) {
          setUserAddress(data.display_name);
        } else {
          setManualEntry(true);
        }
      } catch {
        setManualEntry(true);
      }
    }

    setChecking(false);
  };

  const totalAmount = cart.reduce((sum, item) => {
    let price = item?.price ?? 0;
    price = String(price).replace(/[^\d.]/g, "");
    const p = Number(price);
    return sum + (isNaN(p) ? 0 : p) * (item.qty ?? 0);
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
      alert("Please provide your address.");
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

        <button className="change-address-btn" onClick={handleGetLocation} disabled={checking || locationChecked}>
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
            <textarea className="manual-address-box" placeholder="Type your full address here..." value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
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
        <div className="price-row"><p>Subtotal</p><p>₹{totalAmount}</p></div>
        <div className="price-row"><p>Delivery Charges</p><p>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</p></div>
        <div className="price-total"><strong>Total Amount</strong><strong>₹{grandTotal}</strong></div>

        {locationChecked && <button className="payment-btn" onClick={handlePayment}>Proceed to Payment</button>}
      </div>

      <Footer />
    </div>
  );
}

