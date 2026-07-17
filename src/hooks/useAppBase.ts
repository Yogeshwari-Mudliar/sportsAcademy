import { useMemo } from "react";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";

export function getAppBasePath(role?: string): string {
  if (role === ROLES.admin) return "/admin";
  if (role === ROLES.coach) return "/coach";
  if (role === ROLES.student) return "/student";
  return "/superadmin";
}

export function useAppBase() {
  const user = getCurrentUser();
  return useMemo(() => getAppBasePath(user?.role), [user?.role]);
}
