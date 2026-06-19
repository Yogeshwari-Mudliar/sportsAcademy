// src/constants/sidebar.ts

export const SIDEBAR_CONFIG = {
  SUPER_ADMIN: [
    {
      label: "Dashboard",
      path: "/superadmin/dashboard",
    },
    {
      label: "Academies",
      path: "/superadmin/academies",
    },
    {
      label: "Users",
      path: "/superadmin/users",
    },
    {
      label: "Payments",
      path: "/superadmin/payments",
    },
    {
      label: "Reports",
      path: "/superadmin/reports",
    },
    {
      label: "Settings",
      path: "/superadmin/settings",
    },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      label: "Students",
      path: "/admin/students",
    },
    {
      label: "Coaches",
      path: "/admin/coaches",
    },
    {
      label: "Settings",
      path: "/admin/settings",
    },
  ],

  COACH: [
    {
      label: "Dashboard",
      path: "/coach/dashboard",
    },
  ],

  STUDENT: [
    {
      label: "Dashboard",
      path: "/student/dashboard",
    },
  ],
};