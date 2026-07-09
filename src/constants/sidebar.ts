// src/constants/sidebar.ts

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  CreditCard,
  Trophy,
  BadgeDollarSign,
  FileBarChart,
  Image,
  FileText,
  MessageSquareQuote,
  Bell,
  ShieldCheck,
  KeyRound,
  Settings,
  Activity,
} from "lucide-react";
import type { PermissionKey } from "../data/permissions";

export interface SidebarChild {
  label: string;
  path: string;
  permission?: PermissionKey;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: PermissionKey;
  children?: SidebarChild[];
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export const SUPER_ADMIN_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/superadmin/dashboard", icon: LayoutDashboard, permission: "dashboard" },
      {
        label: "Academies",
        path: "/superadmin/academies",
        icon: Building2,
        permission: "academies",
        children: [
          { label: "Academy List", path: "/superadmin/academies", permission: "academies" },
          { label: "Create Academy", path: "/superadmin/academies/create", permission: "createAcademy" },
        ],
      },
      { label: "Coaches", path: "/superadmin/coaches", icon: Users, permission: "coaches" },
      { label: "Students", path: "/superadmin/students", icon: GraduationCap, permission: "students" },
      
       {
        label: "Manage Users",
        path: "/superadmin/ManageUsers",
        icon: Building2,
        permission: "manageUsers",
        children: [
          { label: "Change Categories", path: "/superadmin/ChangeCategories", permission: "changeCategories" },
          { label: "Change Email", path: "/superadmin/change-email", permission: "changeEmail" },
          { label: "Change Password", path: "/superadmin/change-password", permission: "changePassword" },
        ],
      },

      { label: "Payments", path: "/superadmin/payments", icon: CreditCard },
      { label: "Tournaments", path: "/superadmin/tournaments", icon: Trophy },
      { label: "Subscriptions", path: "/superadmin/subscriptions", icon: BadgeDollarSign },
      { label: "Reports", path: "/superadmin/reports", icon: FileBarChart },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Banners", path: "/superadmin/banners", icon: Image },
      { label: "Pages", path: "/superadmin/pages", icon: FileText },
      { label: "Testimonials", path: "/superadmin/testimonials", icon: MessageSquareQuote },
      { label: "Notifications", path: "/superadmin/notifications", icon: Bell },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Admins", path: "/superadmin/admins", icon: ShieldCheck, permission: "manageUsers" },
      { label: "Roles & Permissions", path: "/superadmin/roles", icon: KeyRound, permission: "rolesPermissions" },
      
      { label: "Settings", path: "/superadmin/settings", icon: Settings, permission: "settings" },
      { label: "Activity Log", path: "/superadmin/activity", icon: Activity },
    ],
  },
];

export const ADMIN_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard" },
      { label: "Students", path: "/admin/students", icon: GraduationCap, permission: "students" },
      { label: "Coaches", path: "/admin/coaches", icon: Users, permission: "coaches" },
      { label: "Settings", path: "/admin/settings", icon: Settings, permission: "settings" },
      { label: "Change Email", path: "/admin/change-email", icon: ShieldCheck },
      { label: "Change Password", path: "/admin/change-password", icon: KeyRound },
    ],
  },
];

export const COACH_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/coach/dashboard", icon: LayoutDashboard, permission: "dashboard" },
      { label: "Change Email", path: "/coach/change-email", icon: ShieldCheck },
      { label: "Change Password", path: "/coach/change-password", icon: KeyRound },
    ],
  },
];

export const STUDENT_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard, permission: "dashboard" },
      { label: "Change Email", path: "/student/change-email", icon: ShieldCheck },
      { label: "Change Password", path: "/student/change-password", icon: KeyRound },
    ],
  },
];
