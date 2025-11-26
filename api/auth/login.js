const { auth, db } = require("../../lib/firebaseAdmin");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../lib/authMiddleware");
const cors = require("cors");

// CORS configuration
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * POST /api/auth/login
 * Login with email/password using Firebase Admin SDK
 */
module.exports = async (req, res) => {
  // Handle CORS
  await new Promise((resolve) => corsHandler(req, res, resolve));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Note: Firebase Admin SDK doesn't have a direct method to verify password
    // The frontend should use Firebase Client SDK for authentication
    // This endpoint is mainly for getting user data after client-side auth

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);

    // Fetch user data from Firestore
    const userDoc = await db.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User data not found" });
    }

    const userData = userDoc.data();

    // Generate JWT token
    const token = jwt.sign(
      { id: userRecord.uid, role: userData.role || "buyer" },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      user: {
        id: userRecord.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        shopName: userData.shopName,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Login failed", details: error.message });
  }
};