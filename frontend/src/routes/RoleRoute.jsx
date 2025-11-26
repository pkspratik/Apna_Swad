import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";

export function RoleRoute({ allowedRole, children }) {
  const { role } = useAuth();

  // If user not logged in or role mismatch → redirect to login
  if (!role || role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
}
