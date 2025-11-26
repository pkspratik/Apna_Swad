const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyBAUUjGoE3pX5jw89Ykdk_BX9CVSD0DIxY",
  authDomain: "apnaswad-796a9.firebaseapp.com",
  projectId: "apnaswad-796a9",
  storageBucket: "apnaswad-796a9.firebasestorage.app",
  messagingSenderId: "1055014739642",
  appId: "1:1055014739642:web:611b6cbf796d60efcdac83",
  measurementId: "G-2KYCT3F20Y",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "admin@apnaswad.com";
const password = "ApnaSwad@12345";

async function setupAdmin() {
  try {
    console.log("Attempting to login as admin...");
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Admin user already exists and login successful.");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.log("⚠️ Admin user not found. Creating new admin user...");
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Admin user created successfully.");
      } catch (createError) {
        console.error("❌ Failed to create admin user:", createError.message);
      }
    } else {
      console.error("❌ Login failed:", error.message);
    }
  }
}

setupAdmin();
