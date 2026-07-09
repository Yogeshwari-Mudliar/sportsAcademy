import { ROLES, type Role } from "../constants/roles";

export type PermissionKey =
  | "dashboard"
  | "academies"
  | "createAcademy"
  | "manageUsers"
  | "changeCategories"
  | "changeEmail"
  | "changePassword"
  | "students"
  | "coaches"
  | "settings"
  | "rolesPermissions";

export interface PermissionModule {
  key: PermissionKey;
  label: string;
  description: string;
}

export const PERMISSIONS_UPDATED_EVENT = "permissionsUpdated";
export const PERMISSIONS_KEY = "role_permissions";

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Dashboard view and summary cards.",
  },
  {
    key: "academies",
    label: "Academies",
    description: "Academy list and academy details access.",
  },
  {
    key: "createAcademy",
    label: "Create Academy",
    description: "Create and edit academy records.",
  },
  {
    key: "manageUsers",
    label: "Manage Users",
    description: "User management menu access.",
  },
  {
    key: "changeCategories",
    label: "Change Categories",
    description: "Move users between super admin, admin, coach and student categories.",
  },
  {
    key: "changeEmail",
    label: "Change Email",
    description: "Update permitted user email addresses.",
  },
  {
    key: "changePassword",
    label: "Change Password",
    description: "Update permitted user passwords.",
  },
  {
    key: "students",
    label: "Students",
    description: "Student pages and student records.",
  },
  {
    key: "coaches",
    label: "Coaches",
    description: "Coach pages and coach records.",
  },
  {
    key: "settings",
    label: "Settings",
    description: "Dashboard settings and appearance.",
  },
  {
    key: "rolesPermissions",
    label: "Roles & Permissions",
    description: "Edit role based access permissions.",
  },
];

const ALL_PERMISSIONS = PERMISSION_MODULES.map((module) => module.key);

const DEFAULT_ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = {
  [ROLES.superadmin]: ALL_PERMISSIONS,
  [ROLES.admin]: ["dashboard", "students", "coaches", "settings", "changeEmail", "changePassword"],
  [ROLES.coach]: ["dashboard", "changeEmail", "changePassword"],
  [ROLES.student]: ["dashboard", "changeEmail", "changePassword"],
};

function sanitizePermissions(value: unknown): PermissionKey[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(ALL_PERMISSIONS);
  return value.filter((item): item is PermissionKey => allowed.has(item as PermissionKey));
}

export function getRolePermissions(): Record<Role, PermissionKey[]> {
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<Record<Role, PermissionKey[]>>;
      return {
        [ROLES.superadmin]: ALL_PERMISSIONS,
        [ROLES.admin]: sanitizePermissions(stored[ROLES.admin]).length
          ? sanitizePermissions(stored[ROLES.admin])
          : DEFAULT_ROLE_PERMISSIONS[ROLES.admin],
        [ROLES.coach]: sanitizePermissions(stored[ROLES.coach]).length
          ? sanitizePermissions(stored[ROLES.coach])
          : DEFAULT_ROLE_PERMISSIONS[ROLES.coach],
        [ROLES.student]: sanitizePermissions(stored[ROLES.student]).length
          ? sanitizePermissions(stored[ROLES.student])
          : DEFAULT_ROLE_PERMISSIONS[ROLES.student],
      };
    }
  } catch {
    /* fall through */
  }

  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
  return DEFAULT_ROLE_PERMISSIONS;
}

export function updateRolePermissions(role: Role, permissions: PermissionKey[]) {
  if (role === ROLES.superadmin) return;

  const nextRolePermissions = Array.from(
    new Set<PermissionKey>(["dashboard", ...sanitizePermissions(permissions)])
  );
  const next = {
    ...getRolePermissions(),
    [role]: nextRolePermissions,
    [ROLES.superadmin]: ALL_PERMISSIONS,
  };

  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PERMISSIONS_UPDATED_EVENT));
}

export function resetRolePermissions() {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
  window.dispatchEvent(new Event(PERMISSIONS_UPDATED_EVENT));
}

export function hasPermission(role: Role, permission: PermissionKey) {
  if (role === ROLES.superadmin) return true;
  return getRolePermissions()[role].includes(permission);
}
