const { db } = require("../../lib/firebaseAdmin");
const { authMiddleware } = require("../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * GET /api/orders/:id - Get specific order (owner, seller, or admin)
 */
module.exports = async (req, res) => {
  // Handle CORS
  await new Promise((resolve) => corsHandler(req, res, resolve));

  // Apply auth middleware
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  }).catch(() => {
    return; // Auth middleware already sent response
  });

  if (!req.user) return; // Auth failed

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract order ID from query parameter
    const orderId = req.query.id;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderData = orderDoc.data();

    // Check authorization: owner, seller (if order contains their items), or admin
    const isOwner = orderData.userId === req.user.userId;
    const isAdmin = req.user.role === "admin";
    const isSeller = req.user.role === "seller"; // Could add more specific seller check

    if (!isOwner && !isAdmin && !isSeller) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json({
      id: orderDoc.id,
      ...orderData,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};