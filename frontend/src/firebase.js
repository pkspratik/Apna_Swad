import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

import { getFirestore } from "firebase/firestore"; // Firestore

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBAUUjGoE3pX5jw89Ykdk_BX9CVSD0DIxY",
  authDomain: "apnaswad-796a9.firebaseapp.com",
  projectId: "apnaswad-796a9",
  storageBucket: "apnaswad-796a9.firebasestorage.app",
  messagingSenderId: "1055014739642",
  appId: "1:1055014739642:web:611b6cbf796d60efcdac83",
  measurementId: "G-2KYCT3F20Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Initialize Firestore + Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();

// ---------- LOGIN FUNCTIONS ----------

// Google Login
export const googleLogin = () => {
  return signInWithPopup(auth, googleProvider);
};

// Email Login
export const emailLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Signup (Email + Password)
export const createAccount = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Forgot Password (Email)
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// ---------- OTP LOGIN ----------
export { RecaptchaVerifier, signInWithPhoneNumber };

// 🔥 Export app (optional but useful)
export default app;
