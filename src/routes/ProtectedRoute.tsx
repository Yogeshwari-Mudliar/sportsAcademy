import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../data/account";

export default function ProtectedRoute() {
  return getCurrentUser() ? <Outlet /> : <Navigate to="/" replace />;
}
