// src/constants/sidebar.ts

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Layers,
  Globe,
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
  segment: string;
  permission?: PermissionKey;
}

export interface SidebarItem {
  label: string;
  segment: string;
  icon: LucideIcon;
  permission?: PermissionKey;
  children?: SidebarChild[];
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

/** Shared sidebar for Super Admin and Admin — visibility controlled by permissions */
export const MANAGEMENT_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", segment: "dashboard", icon: LayoutDashboard, permission: "dashboard" },
      {
        label: "Academies",
        segment: "academies",
        icon: Building2,
        permission: "academies",
        children: [
          { label: "Academy List", segment: "academies", permission: "academies" },
          { label: "Create Academy", segment: "academies/create", permission: "createAcademy" },
          { label: "Add Location", segment: "academies/add-location", permission: "createLocation" },
        ],
      },
      { label: "Coaches", segment: "coaches", icon: Users, permission: "coaches" },
      { label: "Students", segment: "students", icon: GraduationCap, permission: "students" },
      { label: "Batches", segment: "batches", icon: Layers, permission: "batches" },
      { label: "Website Builder", segment: "website-builder", icon: Globe, permission: "websiteBuilder" },
      {
        label: "Manage Users",
        segment: "ManageUsers",
        icon: Building2,
        permission: "manageUsers",
        children: [
          { label: "Change Categories", segment: "ChangeCategories", permission: "changeCategories" },
          { label: "Change Email", segment: "change-email", permission: "changeEmail" },
          { label: "Change Password", segment: "change-password", permission: "changePassword" },
        ],
      },
      { label: "Payments", segment: "payments", icon: CreditCard },
      { label: "Tournaments", segment: "tournaments", icon: Trophy, permission: "tournaments" },
      { label: "Subscriptions", segment: "subscriptions", icon: BadgeDollarSign },
      { label: "Reports", segment: "reports", icon: FileBarChart },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Banners", segment: "banners", icon: Image },
      { label: "Pages", segment: "pages", icon: FileText },
      { label: "Testimonials", segment: "testimonials", icon: MessageSquareQuote },
      { label: "Notifications", segment: "notifications", icon: Bell },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Admins", segment: "admins", icon: ShieldCheck, permission: "manageUsers" },
      { label: "Roles & Permissions", segment: "roles", icon: KeyRound, permission: "rolesPermissions" },
      { label: "Settings", segment: "settings", icon: Settings, permission: "settings" },
      { label: "Activity Log", segment: "activity", icon: Activity },
    ],
  },
];

export const COACH_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", segment: "dashboard", icon: LayoutDashboard, permission: "dashboard" },
      { label: "Batches", segment: "batches", icon: Layers, permission: "batches" },
      { label: "Change Email", segment: "change-email", icon: ShieldCheck },
      { label: "Change Password", segment: "change-password", icon: KeyRound },
    ],
  },
];

export const STUDENT_SIDEBAR: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", segment: "dashboard", icon: LayoutDashboard, permission: "dashboard" },
      { label: "Change Email", segment: "change-email", icon: ShieldCheck },
      { label: "Change Password", segment: "change-password", icon: KeyRound },
    ],
  },
];

/** @deprecated Use MANAGEMENT_SIDEBAR — kept for backward compatibility */
export const SUPER_ADMIN_SIDEBAR = MANAGEMENT_SIDEBAR;

/** @deprecated Use MANAGEMENT_SIDEBAR — kept for backward compatibility */
export const ADMIN_SIDEBAR = MANAGEMENT_SIDEBAR;

export function resolveSidebarPath(basePath: string, segment: string): string {
  return `${basePath}/${segment}`;
}
