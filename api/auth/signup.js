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
 * POST /api/auth/signup
 * Create new user with Firebase Auth + Firestore
 */
module.exports = async (req, res) => {
  // Handle CORS
  await new Promise((resolve) => corsHandler(req, res, resolve));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, name, mobile, address, role, shopName } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    if (role === "seller" && !shopName) {
      return res.status(400).json({ error: "Shop name is required for sellers" });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Store additional user data in Firestore
    const userData = {
      email,
      name,
      mobile: mobile || "",
      address: address || "",
      role: role || "buyer",
      createdAt: new Date().toISOString(),
    };

    if (role === "seller") {
      userData.shopName = shopName;
    }

    await db.collection("users").doc(userRecord.uid).set(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: userRecord.uid, role: userData.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return user data and token
    return res.status(201).json({
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
    console.error("Signup error:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Signup failed", details: error.message });
  }
};