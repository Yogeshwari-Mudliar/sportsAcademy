// src/components/dashboard/Sidebar.tsx

import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Headphones, ChevronRight } from "lucide-react";
import {
  COACH_SIDEBAR,
  MANAGEMENT_SIDEBAR,
  resolveSidebarPath,
  STUDENT_SIDEBAR,
  type SidebarItem,
} from "../../constants/sidebar";
import { useAppSelector } from "../../app/hooks";
import { getCurrentUser } from "../../data/account";
import { ROLE_LABELS, ROLES } from "../../constants/roles";
import { PERMISSIONS_UPDATED_EVENT, hasPermission } from "../../data/permissions";
import { useAppBase } from "../../hooks/useAppBase";
import "../../styles/common/sidebar.css";

function SidebarLink({
  item,
  basePath,
  openSegment,
  onToggle,
}: {
  item: SidebarItem;
  basePath: string;
  openSegment: string | null;
  onToggle: (segment: string) => void;
}) {
  const location = useLocation();
  const Icon = item.icon;
  const itemPath = resolveSidebarPath(basePath, item.segment);

  const childActive = item.children?.some((c) => {
    const childPath = resolveSidebarPath(basePath, c.segment);
    return location.pathname === childPath || location.pathname.startsWith(`${childPath}/`);
  });

  const open = openSegment === item.segment;

  if (item.children && item.children.length > 0) {
    return (
      <div className="sidebar-group-item">
        <button
          type="button"
          className={`sidebar-link ${childActive ? "active" : ""}`}
          onClick={() => onToggle(item.segment)}
        >
          <Icon size={18} className="sidebar-icon" />
          <span>{item.label}</span>
          <ChevronDown size={16} className={`sidebar-caret ${open ? "open" : ""}`} />
        </button>

        {open && (
          <div className="sidebar-submenu">
            {item.children.map((child) => {
              const childPath = resolveSidebarPath(basePath, child.segment);
              return (
                <NavLink
                  key={childPath}
                  to={childPath}
                  end={child.segment === "academies"}
                  className={({ isActive }) => `sidebar-sublink ${isActive ? "active" : ""}`}
                >
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={itemPath}
      end
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
    >
      <Icon size={18} className="sidebar-icon" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const location = useLocation();
  const [permissionsVersion, setPermissionsVersion] = useState(0);
  const [openSegment, setOpenSegment] = useState<string | null>(null);
  const user = getCurrentUser();
  const role = user?.role ?? ROLES.student;
  const basePath = useAppBase();

  const baseSidebarGroups =
    role === ROLES.superadmin || role === ROLES.admin
      ? MANAGEMENT_SIDEBAR
      : role === ROLES.coach
      ? COACH_SIDEBAR
      : STUDENT_SIDEBAR;

  const sidebarGroups = useMemo(
    () =>
      baseSidebarGroups
        .map((group) => ({
          ...group,
          items: group.items
            .filter((item) => !item.permission || hasPermission(role, item.permission))
            .map((item) => ({
              ...item,
              children: item.children?.filter(
                (child) => !child.permission || hasPermission(role, child.permission)
              ),
            }))
            .filter((item) => !item.children || item.children.length > 0),
        }))
        .filter((group) => group.items.length > 0),
    [baseSidebarGroups, permissionsVersion, role]
  );

  // Auto-open the dropdown that matches current route (and close others)
  useEffect(() => {
    let active: string | null = null;
    for (const group of sidebarGroups) {
      for (const item of group.items) {
        if (!item.children?.length) continue;
        const match = item.children.some((c) => {
          const childPath = resolveSidebarPath(basePath, c.segment);
          return (
            location.pathname === childPath ||
            location.pathname.startsWith(`${childPath}/`)
          );
        });
        if (match) {
          active = item.segment;
          break;
        }
      }
      if (active) break;
    }
    setOpenSegment(active);
  }, [location.pathname, sidebarGroups, basePath]);

  useEffect(() => {
    const refresh = () => setPermissionsVersion((value) => value + 1);
    window.addEventListener(PERMISSIONS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PERMISSIONS_UPDATED_EVENT, refresh);
  }, []);

  const handleToggle = (segment: string) => {
    setOpenSegment((prev) => (prev === segment ? null : segment));
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo-container">
          <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5C50 5 85 15 85 45C85 75 50 95 50 95C50 95 15 75 15 45C15 15 50 5 50 5Z" fill="url(#logo-grad)" stroke="#ffffff" strokeWidth="2"/>
            <path d="M35 75L68 30C69 28.5 71.5 28.5 72.5 30C73.5 31.5 73.5 34 72 35L39 80L35 75Z" fill="#ffffff" />
            <path d="M68 30L73.5 22.5C74.5 21 76.5 22.5 75.5 24L70 31.5L68 30Z" fill="#ff7a00" stroke="#ffffff" strokeWidth="1" />
            <circle cx="62" cy="58" r="7" fill="#ffffff" />
            <path d="M57 58C57 56 62 53 67 58" stroke="#ff7a00" strokeWidth="0.8" fill="none" />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5e00" />
                <stop offset="100%" stopColor="#ff8e3c" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <h1>
            CRICKET <span>ACADEMY</span>
          </h1>
          <p>{ROLE_LABELS[role]}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="sidebar-section">
            <p className="sidebar-section-title">{group.title}</p>
            {group.items.map((item) => (
              <SidebarLink
                key={item.segment}
                item={item}
                basePath={basePath}
                openSegment={openSegment}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-support-card">
        <div className="support-icon-wrap">
          <Headphones size={18} />
        </div>
        <div className="support-text-wrap">
          <h4>Need Help?</h4>
          <p>Contact Support</p>
        </div>
        <ChevronRight size={14} className="support-arrow" />
      </div>
    </aside>
  );
}
