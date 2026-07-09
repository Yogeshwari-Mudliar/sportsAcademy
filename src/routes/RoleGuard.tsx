import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../data/account";
import { ROLE_HOME_PATHS, type Role } from "../constants/roles";

interface RoleGuardProps {
  allowedRoles: Role[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_PATHS[user.role]} replace />;
  }

  return <Outlet />;
}
