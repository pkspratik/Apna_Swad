const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_KEY || "{}");
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw new Error("Failed to initialize Firebase Admin SDK");
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };