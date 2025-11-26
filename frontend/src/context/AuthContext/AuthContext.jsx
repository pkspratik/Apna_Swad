// -------------------------
// All Imports at Top
// -------------------------
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../adminConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto detect login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log("🔥 Firebase Auth State:", firebaseUser);

        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);

          let userRole = "customer";

          if (snap.exists()) {
            userRole = snap.data().role;
            console.log("📌 User role from Firestore:", userRole);
          } else {
            if (firebaseUser.email === ADMIN_EMAIL) userRole = "admin";

            await setDoc(
              userRef,
              { email: firebaseUser.email, role: userRole },
              { merge: true }
            );
          }

          setUser(firebaseUser);
          setRole(userRole);
        } else {
          console.log("⚠ No user logged in");
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("🔥 Auth State Error:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ===================================
  // 🔐 LOGIN FUNCTION (with full logs)
  // ===================================
  const login = async (email, password) => {
    try {
      console.log("🟦 Login Attempt ------------------------");
      console.log("Typed Email:", email);
      console.log("Typed Password:", password);
      console.log("Admin Email from Config:", ADMIN_EMAIL);
      console.log("Admin Password from Config:", ADMIN_PASSWORD);

      // ===================================
      // ⭐ FIXED ADMIN LOGIN CHECK
      // ===================================
      // ===================================
      // ⭐ FIXED ADMIN LOGIN CHECK
      // ===================================
      // if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      //   console.log("🎉 ADMIN LOGIN SUCCESS (Bypassed Firebase)");
      //   // ... bypass removed to ensure Firestore access ...
      // }

      console.log("🟠 Attempting Firebase Customer Login...");

      // ===================================
      // 🔐 CUSTOMER LOGIN (Firebase Auth)
      // ===================================
      const res = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = res.user;

      console.log("🟢 FIREBASE LOGIN SUCCESS:", currentUser.email);

      let userRole =
        currentUser.email === ADMIN_EMAIL ? "admin" : "customer";

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          email: currentUser.email,
          role: userRole,
        },
        { merge: true }
      );

      setUser(currentUser);
      setRole(userRole);

      return userRole;
    } catch (error) {
      console.error("❌ Login Error:", error);
      throw error; // Return error to Login.jsx
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    console.log("🚪 User Logged Out");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        setUser,
        setRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
