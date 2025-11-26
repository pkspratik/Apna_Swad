import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

// 👑 Admin Email
const ADMIN_EMAIL = "apnaswad99@gmail.com";


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // admin | customer
  const [loading, setLoading] = useState(true);

  // 🔥 Auto detect login / logout on ANY device
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        let userRole = "customer";

        // first time login
        if (snap.exists()) {
          userRole = snap.data().role;
        } else {
          // detect admin by email
          if (firebaseUser.email === ADMIN_EMAIL) userRole = "admin";

          await setDoc(
            userRef,
            {
              email: firebaseUser.email,
              role: userRole,
            },
            { merge: true }
          );
        }

        setUser(firebaseUser);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Email & Password Login
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = res.user;

    let userRole = currentUser.email === ADMIN_EMAIL ? "admin" : "customer";

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
  };

  // 🔴 Logout handler
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
        setUser,  // 🌟 newly added
        setRole,  // 🌟 newly added
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
