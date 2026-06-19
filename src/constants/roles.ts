// src/constants/roles.ts

export const ROLES = {
  superadmin: "superadmin",
  ADMIN: "ADMIN",
  COACH: "COACH",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];