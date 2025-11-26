const { db } = require("../../../lib/firebaseAdmin");
const { authMiddleware } = require("../../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * GET /api/orders/seller/list - Get all orders for seller
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
    // Only sellers and admins can access this endpoint
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Seller access required" });
    }

    // Get all orders (sellers can see all orders to fulfill)
    // In a real app, you might filter by seller's items
    const ordersSnapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get seller orders error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};