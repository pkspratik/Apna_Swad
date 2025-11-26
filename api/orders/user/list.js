const { db } = require("../../../lib/firebaseAdmin");
const { authMiddleware } = require("../../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * GET /api/orders/user/list - Get all orders for current user
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
    // Get orders for the current user
    const ordersSnapshot = await db
      .collection("orders")
      .where("userId", "==", req.user.userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get user orders error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};