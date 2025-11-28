const { db } = require("../../lib/firebaseAdmin");
const { authMiddleware } = require("../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * POST /api/orders/create - Create new order with atomic order ID generation
 * This endpoint uses Firestore transactions to ensure unique order IDs
 * even when multiple users place orders simultaneously
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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, total, address, paymentMethod } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required and cannot be empty" });
    }

    if (!total || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ error: "Valid total amount is required" });
    }

    if (!address || typeof address !== "string" || address.trim() === "") {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    // Use Firestore transaction to atomically generate order ID and create order
    const orderData = await db.runTransaction(async (transaction) => {
      // Reference to the counter document
      const counterRef = db.collection("counters").doc("orderCounter");
      const counterDoc = await transaction.get(counterRef);

      let newOrderId;

      if (!counterDoc.exists) {
        // Initialize counter if it doesn't exist
        newOrderId = 1000; // Start from 1000 for better looking order IDs
        transaction.set(counterRef, { value: newOrderId + 1 });
      } else {
        // Increment the counter
        newOrderId = counterDoc.data().value;
        transaction.update(counterRef, { value: newOrderId + 1 });
      }

      // Create the order document with the generated ID
      const orderRef = db.collection("orders").doc(String(newOrderId));

      const order = {
        orderId: newOrderId,
        userId: req.user.userId,
        items: items,
        total: total,
        address: address,
        paymentMethod: paymentMethod || "cod",
        status: "Order Placed",
        createdAt: new Date(),
        boyName: "",
        boyPhone: "",
      };

      transaction.set(orderRef, order);

      return {
        id: String(newOrderId),
        ...order,
      };
    });

    console.log(`✅ Order created successfully: ${orderData.orderId}`);

    return res.status(201).json({
      success: true,
      order: orderData,
    });

  } catch (error) {
    console.error("❌ Order creation error:", error);

    // Handle specific transaction errors
    if (error.code === "ABORTED" || error.code === "FAILED_PRECONDITION") {
      return res.status(409).json({
        error: "Order creation conflict. Please try again.",
        details: error.message
      });
    }

    return res.status(500).json({
      error: "Failed to create order",
      details: error.message
    });
  }
};
