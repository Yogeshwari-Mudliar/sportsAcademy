import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";

export function canManageTables(): boolean {
  const user = getCurrentUser();
  return user?.role === ROLES.superadmin || user?.role === ROLES.admin;
}

export function useCanManageTables(): boolean {
  return canManageTables();
}
