const { db } = require("../../../lib/firebaseAdmin");
const { authMiddleware } = require("../../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * PUT /api/orders/:id/status - Update order status (seller or admin)
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

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Only sellers and admins can update order status
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Seller or admin access required" });
    }

    // Extract order ID from query parameter
    const orderId = req.query.id;
    const { status, boyName, boyPhone } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    const updateData = {
      status,
      updatedAt: new Date(),
    };

    if (boyName) updateData.boyName = boyName;
    if (boyPhone) updateData.boyPhone = boyPhone;

    await orderRef.update(updateData);

    return res.status(200).json({
      message: "Order status updated successfully",
      orderId,
      ...updateData,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};