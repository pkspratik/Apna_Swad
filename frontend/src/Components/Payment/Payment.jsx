import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";

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

  // -------------------------------
  // ⭐ SAVE ORDER — SAME orderId IS DOC ID
  // -------------------------------
  const saveOrderToFirebase = async (orderId, mode, addressText) => {
    const cartBackup = getCartBackup();
    const currentUser = auth.currentUser;

    if (!currentUser) throw new Error("User not logged in!");
    if (!cartBackup || cartBackup.length === 0) throw new Error("Cart empty!");

    const orderRef = doc(db, "orders", String(orderId));

    const orderDetails = {
      orderId: Number(orderId),
      userId: currentUser.uid,
      items: cartBackup,
      total: totalPrice,
      address: addressText,
      paymentMethod: mode,
      status: "Order Placed",
      createdAt: serverTimestamp(),
      boyName: "",
      boyPhone: "",
    };

    await setDoc(orderRef, orderDetails, { merge: true });

    return orderDetails;
  };

  // --------------------------------
  // ⭐ COD ORDER
  // --------------------------------
  const handleCODOrder = async () => {
    if (!deliveryInfo?.fullAddress) return alert("Please detect your location first");

    const addressText = `${deliveryInfo.fullAddress} — Phone: ${deliveryInfo.phone}`;

    try {
      const orderId = Date.now();

      const saved = await saveOrderToFirebase(orderId, "cod", addressText);

      // Save fallback id
      localStorage.setItem("apnaSwad_last_order", orderId);

      // SEND CORRECT DATA TO ORDER SUCCESS
      navigate("/order-success", {
        state: {
          docId: String(orderId),
          orderId: Number(orderId),
          totalPrice: totalPrice,
          address: addressText,
          paymentMethod: "cod",
        },
      });
    } catch (err) {
      alert("COD Failed: " + err.message);
    }
  };

  // --------------------------------
  // ⭐ UPI ORDER
  // --------------------------------
  const handleUPIPaid = async () => {
    if (!deliveryInfo?.fullAddress) return alert("Please detect your location first");

    const addressText = `${deliveryInfo.fullAddress} — Phone: ${deliveryInfo.phone}`;

    try {
      const orderId = Date.now();

      const saved = await saveOrderToFirebase(orderId, "upi", addressText);

      localStorage.setItem("apnaSwad_last_order", orderId);

      // SEND CORRECT DATA TO ORDER SUCCESS
      navigate("/order-success", {
        state: {
          docId: String(orderId),
          orderId: Number(orderId),
          totalPrice: totalPrice,
          address: addressText,
          paymentMethod: "upi",
        },
      });
    } catch (err) {
      alert("UPI Failed: " + err.message);
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
