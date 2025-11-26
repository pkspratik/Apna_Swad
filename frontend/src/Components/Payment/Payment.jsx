import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";   // 👈 import auth too

export function Payment() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const UPI_ID = "pratikk512@ybl";
  const UPI_NAME = "Pratik Singh";

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price.replace("₹", "")) * item.qty,
    0
  );
  const deliveryCharge = subtotal >= 499 ? 0 : 40;
  const totalPrice = subtotal + deliveryCharge;

  useEffect(() => {
    const info = localStorage.getItem("apnaSwad_delivery_info");
    if (info) setDeliveryInfo(JSON.parse(info));
  }, []);

  const upiLink = `upi://pay?pa=${encodeURIComponent(
    UPI_ID
  )}&pn=${encodeURIComponent(
    UPI_NAME
  )}&am=${encodeURIComponent(totalPrice)}&cu=INR&tn=${encodeURIComponent(
    "Apna Swad Food Order"
  )}`;

  const getCurrentOrderId = () => localStorage.getItem("apnaSwad_current_order");

  const getCartBackup = () =>
    cart.length > 0 ? cart : JSON.parse(localStorage.getItem("cartItems") || "[]");

  // ⭐ Save order to Firebase (includes userId — important)
  const saveOrderToFirebase = async (orderId, mode, addressText) => {
    const cartBackup = getCartBackup();
    if (!cartBackup || cartBackup.length === 0) {
      throw new Error("Cart is empty – cannot save order.");
    }

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in.");

    const orderRef = doc(db, "orders", String(orderId));

    const orderDetails = {
      orderId: Number(orderId),
      userId: currentUser.uid,  // ⭐ REQUIRED for Firestore security rules
      items: cartBackup,
      total: totalPrice,
      address: addressText,
      paymentMethod: mode,
      status: "Order Placed",
      createdAt: serverTimestamp(),
      boyName: "",
      boyPhone: "",
    };

    await setDoc(orderRef, orderDetails);
  };

  // ---------------- COD ----------------
  const handleCODOrder = async () => {
    const orderId = getCurrentOrderId();
    if (!orderId) return navigate("/summary");

    const addressText = deliveryInfo?.fullAddress
      ? `${deliveryInfo.fullAddress} — Phone: ${deliveryInfo.phone || ""}`
      : "Address Not Available";

    try {
      await saveOrderToFirebase(orderId, "cod", addressText);

      localStorage.setItem("apnaSwad_last_order", orderId);
      localStorage.removeItem("apnaSwad_current_order");
      localStorage.removeItem("cartItems");

      setTimeout(() => {
        navigate("/order-success", {
          state: {
            orderId,
            cartItems: getCartBackup(),
            totalPrice,
            address: addressText,
            paymentMethod: "cod",
          },
        });
      }, 10);
    } catch (err) {
      console.error("COD order error:", err);
      alert("Unable to place order (COD): " + err.message);
    }
  };

  // ---------------- UPI ----------------
  const handleUPIPaid = async () => {
    const orderId = getCurrentOrderId();
    if (!orderId) return navigate("/summary");

    const addressText = deliveryInfo?.fullAddress
      ? `${deliveryInfo.fullAddress} — Phone: ${deliveryInfo.phone || ""}`
      : "Address Not Available";

    try {
      await saveOrderToFirebase(orderId, "upi", addressText);

      localStorage.setItem("apnaSwad_last_order", orderId);
      localStorage.removeItem("apnaSwad_current_order");
      localStorage.removeItem("cartItems");

      setTimeout(() => {
        navigate("/order-success", {
          state: {
            orderId,
            cartItems: getCartBackup(),
            totalPrice,
            address: addressText,
            paymentMethod: "upi",
          },
        });
      }, 10);
    } catch (err) {
      console.error("UPI order error:", err);
      alert("Unable to place order (UPI): " + err.message);
    }
  };

  const handleOrderConfirm = () => {
    if (!paymentMethod) return alert("Please select a payment option");
    if (paymentMethod === "cod") handleCODOrder();
  };

  return (
    <div className="payment-container">
      <h2>Choose Payment Method</h2>

      {/* COD */}
      <div
        className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
        onClick={() => setPaymentMethod("cod")}
      >
        <input type="radio" checked={paymentMethod === "cod"} readOnly />
        <label>💵 Cash on Delivery (COD)</label>
      </div>

      {/* UPI */}
      <div
        className={`payment-option ${paymentMethod === "upi" ? "selected" : ""}`}
        onClick={() => setPaymentMethod("upi")}
      >
        <input type="radio" checked={paymentMethod === "upi"} readOnly />
        <label>📱 Online Payment / UPI (GPay, PhonePe, Paytm)</label>
      </div>

      {paymentMethod === "upi" && (
        <div className="upi-box">
          <h3>Pay using UPI</h3>
          <img
            className="upi-qr"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
              upiLink
            )}`}
            alt="UPI QR"
          />
          <button className="upi-pay-btn" onClick={() => (window.location.href = upiLink)}>
            Open in UPI App
          </button>
          <button className="upi-confirm-btn" onClick={handleUPIPaid}>
            ✅ I have completed the payment
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
        {paymentMethod === "cod" ? "Place Order (COD)" : "Select COD to continue"}
      </button>
    </div>
  );
}
