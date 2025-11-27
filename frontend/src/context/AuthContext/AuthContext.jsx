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
import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../adminConfig";

const AuthContext = createContext();

// Generate unique session ID
const generateSessionId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  // -----------------------
  // SESSION MONITORING FOR ADMIN
  // -----------------------
  useEffect(() => {
    if (!user || role !== "admin" || !sessionId) return;

    // Monitor current session validity
    const sessionRef = doc(db, "adminSessions", sessionId);
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const sessionData = snapshot.data();

        // If session is marked as invalid, logout
        if (sessionData.isValid === false) {
          console.log("🚫 Session invalidated - logging out");
          logout();
        }
      } else {
        // Session document deleted, logout
        console.log("🚫 Session not found - logging out");
        logout();
      }
    });

    return () => unsubscribe();
  }, [user, role, sessionId]);

  // -----------------------
  // INVALIDATE OLD SESSIONS
  // -----------------------
  const invalidateOldSessions = async (userId) => {
    try {
      const sessionsRef = collection(db, "adminSessions");
      const q = query(sessionsRef, where("userId", "==", userId), where("isValid", "==", true));
      const snapshot = await getDocs(q);

      // Mark all existing sessions as invalid
      const promises = snapshot.docs.map((doc) =>
        setDoc(doc.ref, { isValid: false }, { merge: true })
      );

      await Promise.all(promises);
      console.log(`✅ Invalidated ${snapshot.docs.length} old session(s)`);
    } catch (error) {
      console.error("❌ Error invalidating old sessions:", error);
    }
  };

  // -----------------------
  // CREATE NEW SESSION
  // -----------------------
  const createSession = async (userId, userEmail) => {
    try {
      const newSessionId = generateSessionId();
      const sessionRef = doc(db, "adminSessions", newSessionId);

      await setDoc(sessionRef, {
        userId,
        email: userEmail,
        createdAt: new Date(),
        isValid: true,
        deviceInfo: navigator.userAgent,
      });

      setSessionId(newSessionId);
      localStorage.setItem("adminSessionId", newSessionId);

      console.log("✅ New session created:", newSessionId);
      return newSessionId;
    } catch (error) {
      console.error("❌ Error creating session:", error);
    }
  };

  // -----------------------
  // AUTO LOGIN STATE CHECK
  // -----------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setRole(null);
          setSessionId(null);
          localStorage.removeItem("adminSessionId");
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

        // For admin, restore session ID from localStorage
        if (userRole === "admin") {
          const storedSessionId = localStorage.getItem("adminSessionId");
          if (storedSessionId) {
            setSessionId(storedSessionId);
          }
        }
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

      // -----------------------
      // ADMIN SESSION MANAGEMENT
      // -----------------------
      if (userRole === "admin") {
        // Invalidate all old sessions
        await invalidateOldSessions(currentUser.uid);

        // Create new session
        await createSession(currentUser.uid, currentUser.email);
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
    // Invalidate current session if admin
    if (role === "admin" && sessionId) {
      try {
        const sessionRef = doc(db, "adminSessions", sessionId);
        await setDoc(sessionRef, { isValid: false }, { merge: true });
      } catch (error) {
        console.error("Error invalidating session on logout:", error);
      }
    }

    await signOut(auth);
    setUser(null);
    setRole(null);
    setSessionId(null);
    localStorage.removeItem("adminSessionId");
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
