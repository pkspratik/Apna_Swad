// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext/AuthContext";

// export function RoleRoute({ allowedRole, children }) {
//   const { role } = useAuth();

//   // If user not logged in or role mismatch → redirect to login
//   if (!role || role !== allowedRole) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";

export function RoleRoute({ allowedRole, children }) {
  const { user, role, loading } = useAuth();

  if (loading) return null; // ⏳ wait for Firebase  

  // Not logged in → send to correct login page
  if (!user) {
    return allowedRole === "admin"
      ? <Navigate to="/admin-auth" replace />
      : <Navigate to="/login" replace />;
  }

  // Wrong role → block
  if (role !== allowedRole) {
    return allowedRole === "admin"
      ? <Navigate to="/admin-auth" replace />
      : <Navigate to="/" replace />;
  }

  return children;
}
