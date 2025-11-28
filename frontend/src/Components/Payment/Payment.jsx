import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { auth } from "../../firebase";

export function Payment() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const UPI_ID = "pratikk512@ybl";
  const UPI_NAME = "Pratik Singh";

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert("Please login to continue");
      navigate("/login?redirect=payment");
    }
  }, [user, navigate]);

  // Load saved address from summary page
  useEffect(() => {
    const info = localStorage.getItem("apnaSwad_delivery_info");
    if (info) setDeliveryInfo(JSON.parse(info));
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price.replace("₹", "")) * item.qty,
    0
  );

  const deliveryCharge = subtotal >= 499 ? 0 : 40;
  const totalPrice = subtotal + deliveryCharge;

  const upiLink = `upi://pay?pa=${encodeURIComponent(
    UPI_ID
  )}&pn=${encodeURIComponent(
    UPI_NAME
  )}&am=${encodeURIComponent(totalPrice)}&cu=INR&tn=${encodeURIComponent(
    "Apna Swad Order"
  )}`;

  const getCartBackup = () =>
    cart.length > 0 ? cart : JSON.parse(localStorage.getItem("cartItems") || "[]");


  // --------------------------------
  // ⭐ COD ORDER - Hybrid: Try Backend API, fallback to Client-side Firestore
  // --------------------------------
  const handleCODOrder = async () => {
    if (!deliveryInfo?.fullAddress) return alert("Please detect your location first");

    const addressText = `${deliveryInfo.fullAddress} — Phone: ${deliveryInfo.phone}`;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not logged in!");

      const cartBackup = getCartBackup();
      if (!cartBackup || cartBackup.length === 0) throw new Error("Cart is empty!");

      let orderId;
      let useBackend = true;

      try {
        // Try backend API first
        const token = await currentUser.getIdToken();
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartBackup,
            total: totalPrice,
            address: addressText,
            paymentMethod: "cod",
          }),
        });

        if (!response.ok) {
          throw new Error("Backend API not available");
        }

        const result = await response.json();
        orderId = result.order.orderId;
      } catch (backendError) {
        console.warn("Backend API failed, using client-side Firestore:", backendError.message);
        useBackend = false;

        // Fallback to client-side Firestore
        const { db } = await import("../../firebase");
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

        const docRef = await addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          items: cartBackup,
          total: totalPrice,
          address: addressText,
          paymentMethod: "cod",
          status: "Order Placed",
          createdAt: serverTimestamp(),
          boyName: "",
          boyPhone: "",
        });

        orderId = docRef.id;

        // Update the document with its own ID as orderId field
        const { doc: docFunc, updateDoc } = await import("firebase/firestore");
        await updateDoc(docFunc(db, "orders", docRef.id), { orderId: docRef.id });
      }

      // Save fallback id
      localStorage.setItem("apnaSwad_last_order", orderId);

      // Navigate to order success
      navigate("/order-success", {
        state: {
          docId: String(orderId),
          orderId: useBackend ? Number(orderId) : orderId,
          totalPrice: totalPrice,
          address: addressText,
          paymentMethod: "cod",
        },
      });
    } catch (err) {
      console.error("COD Order Error:", err);
      alert("Order Failed: " + err.message);
    }
  };

  // --------------------------------
  // ⭐ UPI ORDER - Hybrid: Try Backend API, fallback to Client-side Firestore
  // --------------------------------
  const handleUPIPaid = async () => {
    if (!deliveryInfo?.fullAddress) return alert("Please detect your location first");

    const addressText = `${deliveryInfo.fullAddress} — Phone: ${deliveryInfo.phone}`;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not logged in!");

      const cartBackup = getCartBackup();
      if (!cartBackup || cartBackup.length === 0) throw new Error("Cart is empty!");

      let orderId;
      let useBackend = true;

      try {
        // Try backend API first
        const token = await currentUser.getIdToken();
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartBackup,
            total: totalPrice,
            address: addressText,
            paymentMethod: "upi",
          }),
        });

        if (!response.ok) {
          throw new Error("Backend API not available");
        }

        const result = await response.json();
        orderId = result.order.orderId;
      } catch (backendError) {
        console.warn("Backend API failed, using client-side Firestore:", backendError.message);
        useBackend = false;

        // Fallback to client-side Firestore
        const { db } = await import("../../firebase");
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

        const docRef = await addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          items: cartBackup,
          total: totalPrice,
          address: addressText,
          paymentMethod: "upi",
          status: "Order Placed",
          createdAt: serverTimestamp(),
          boyName: "",
          boyPhone: "",
        });

        orderId = docRef.id;

        // Update the document with its own ID as orderId field
        const { doc: docFunc, updateDoc } = await import("firebase/firestore");
        await updateDoc(docFunc(db, "orders", docRef.id), { orderId: docRef.id });
      }

      localStorage.setItem("apnaSwad_last_order", orderId);

      // Navigate to order success
      navigate("/order-success", {
        state: {
          docId: String(orderId),
          orderId: useBackend ? Number(orderId) : orderId,
          totalPrice: totalPrice,
          address: addressText,
          paymentMethod: "upi",
        },
      });
    } catch (err) {
      console.error("UPI Order Error:", err);
      alert("UPI Payment Failed: " + err.message);
    }
  };

  const handleOrderConfirm = () => {
    if (!paymentMethod) return alert("Select a payment method");
    if (paymentMethod === "cod") handleCODOrder();
  };

  return (
    <div className="payment-container">
      <h2>Choose Payment Method</h2>

      {/* COD Option */}
      <div
        className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
        onClick={() => setPaymentMethod("cod")}
      >
        <input type="radio" checked={paymentMethod === "cod"} readOnly />
        <label>💵 Cash on Delivery (COD)</label>
      </div>

      {/* UPI Option */}
      <div
        className={`payment-option ${paymentMethod === "upi" ? "selected" : ""}`}
        onClick={() => setPaymentMethod("upi")}
      >
        <input type="radio" checked={paymentMethod === "upi"} readOnly />
        <label>📱 UPI Payment</label>
      </div>

      {paymentMethod === "upi" && (
        <div className="upi-box">
          <h3>Scan & Pay</h3>

          <img
            className="upi-qr"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
              upiLink
            )}`}
            alt="UPI QR"
          />

          <button className="upi-pay-btn" onClick={() => (window.location.href = upiLink)}>
            Open UPI App
          </button>

          <button className="upi-confirm-btn" onClick={handleUPIPaid}>
            ✅ I have paid
          </button>
        </div>
      )}

      <div className="total-box">
        <p>Total Bill</p>
        <h3>₹{totalPrice}</h3>
      </div>

      <button
        className="confirm-btn"
        disabled={!paymentMethod || paymentMethod === "upi"}
        onClick={handleOrderConfirm}
      >
        {paymentMethod === "cod" ? "Place Order (COD)" : "Select COD to place order"}
      </button>
    </div>
  );
}
