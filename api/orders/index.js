const { db } = require("../../lib/firebaseAdmin");
const { authMiddleware } = require("../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * GET /api/orders - List all orders (admin only)
 * POST /api/orders - Create new order (authenticated users)
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

  try {
    // GET - List all orders (admin only)
    if (req.method === "GET") {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const ordersSnapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
      const orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ orders });
    }

    // POST - Create new order
    if (req.method === "POST") {
      const { items, total, address, paymentMethod } = req.body;

      if (!items || !total || !address) {
        return res.status(400).json({ error: "Items, total, and address are required" });
      }

      const orderData = {
        userId: req.user.userId,
        items,
        total,
        address,
        paymentMethod: paymentMethod || "cod",
        status: "Order Placed",
        createdAt: new Date(),
        boyName: "",
        boyPhone: "",
      };

      const orderRef = await db.collection("orders").add(orderData);

      return res.status(201).json({
        orderId: orderRef.id,
        ...orderData,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Orders endpoint error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};