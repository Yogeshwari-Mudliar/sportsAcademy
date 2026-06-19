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

export interface SidebarChild {
  label: string;
  path: string;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
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
      { label: "Dashboard", path: "/superadmin/dashboard", icon: LayoutDashboard },
      {
        label: "Academies",
        path: "/superadmin/academies",
        icon: Building2,
        children: [
          { label: "Academy List", path: "/superadmin/academies" },
          { label: "Create Academy", path: "/superadmin/academies/create" },
        ],
      },
      { label: "Coaches", path: "/superadmin/coaches", icon: Users },
      { label: "Students", path: "/superadmin/students", icon: GraduationCap },
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
      { label: "Admins", path: "/superadmin/admins", icon: ShieldCheck },
      { label: "Roles & Permissions", path: "/superadmin/roles", icon: KeyRound },
      { label: "Settings", path: "/superadmin/settings", icon: Settings },
      { label: "Activity Log", path: "/superadmin/activity", icon: Activity },
    ],
  },
];
