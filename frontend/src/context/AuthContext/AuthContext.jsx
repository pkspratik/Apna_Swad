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

  // -----------------------
  // AUTO LOGIN STATE CHECK
  // -----------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        console.log("🔥 Auth User:", firebaseUser.email);

        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        let userRole = "customer";

        // If user exists, load data
        if (snap.exists()) {
          const data = snap.data();
          userRole = data.role || "customer";
        } else {
          // -------------------------
          // FIRST LOGIN → CREATE USER
          // -------------------------
          userRole = firebaseUser.email === ADMIN_EMAIL ? "admin" : "customer";

          await setDoc(
            userRef,
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userRole,
              name: "",
              mobile: "",
              address: "",
              createdAt: new Date(),
            },
            { merge: true }
          );
        }

        setUser(firebaseUser);
        setRole(userRole);
      } catch (err) {
        console.error("🔥 Auth State Error:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // -----------------------
  // LOGIN FUNCTION
  // -----------------------
  const login = async (email, password) => {
    try {
      console.log("🟦 Login Attempt:", email);

      // AUTHENTICATE
      const res = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = res.user;

      let userRole =
        currentUser.email === ADMIN_EMAIL ? "admin" : "customer";

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      // -----------------------
      // CREATE USER IF MISSING
      // -----------------------
      if (!snap.exists()) {
        await setDoc(
          userRef,
          {
            uid: currentUser.uid,
            email: currentUser.email,
            role: userRole,
            name: "",
            mobile: "",
            address: "",
            createdAt: new Date(),
          },
          { merge: true }
        );
      } else {
        // Update role if needed
        await setDoc(
          userRef,
          { role: userRole },
          { merge: true }
        );
      }

      setUser(currentUser);
      setRole(userRole);

      return userRole;
    } catch (error) {
      console.error("❌ Login Error:", error);
      throw error;
    }
  };

  // -----------------------
  // LOGOUT
  // -----------------------
  const logout = async () => {
    await signOut(auth);
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
