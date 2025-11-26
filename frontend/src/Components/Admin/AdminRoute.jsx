import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";

export default function AdminRoute() {
  const { user, role, loading } = useAuth();

  // Wait while Firebase checks login
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin → block
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Logged in + admin → allow dashboard
  return <Outlet />;
}
