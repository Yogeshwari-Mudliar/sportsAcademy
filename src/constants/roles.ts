// src/constants/roles.ts

export const ROLES = {
  superadmin: "superadmin",
  admin: "admin",
  coach: "coach",
  student: "student",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.superadmin]: "Super Admin",
  [ROLES.admin]: "Admin",
  [ROLES.coach]: "Coach",
  [ROLES.student]: "Student",
};

export const ROLE_HOME_PATHS: Record<Role, string> = {
  [ROLES.superadmin]: "/superadmin/dashboard",
  [ROLES.admin]: "/admin/dashboard",
  [ROLES.coach]: "/coach/dashboard",
  [ROLES.student]: "/student/dashboard",
};

export function isRole(value: unknown): value is Role {
  return Object.values(ROLES).includes(value as Role);
}
