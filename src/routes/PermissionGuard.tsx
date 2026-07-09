import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../data/account";
import { hasPermission, type PermissionKey } from "../data/permissions";
import { ROLE_HOME_PATHS } from "../constants/roles";

interface PermissionGuardProps {
  permission: PermissionKey;
}

export default function PermissionGuard({ permission }: PermissionGuardProps) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!hasPermission(user.role, permission)) {
    return <Navigate to={ROLE_HOME_PATHS[user.role]} replace />;
  }

  return <Outlet />;
}
