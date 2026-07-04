// src/components/dashboard/Sidebar.tsx

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Headphones, ChevronRight } from "lucide-react";
import { SUPER_ADMIN_SIDEBAR } from "../../constants/sidebar";
import type { SidebarItem } from "../../constants/sidebar";
import { useAppSelector } from "../../app/hooks";
import "../../styles/common/sidebar.css";

function SidebarLink({ item }: { item: SidebarItem }) {
  const location = useLocation();
  const Icon = item.icon;

  const childActive = item.children?.some((c) =>
    location.pathname.startsWith(c.path)
  );

  const [open, setOpen] = useState<boolean>(Boolean(childActive));

  if (item.children && item.children.length > 0) {
    return (
      <div className="sidebar-group-item">
        <button
          type="button"
          className={`sidebar-link ${childActive ? "active" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon size={18} className="sidebar-icon" />
          <span>{item.label}</span>
          <ChevronDown
            size={16}
            className={`sidebar-caret ${open ? "open" : ""}`}
          />
        </button>

        {open && (
          <div className="sidebar-submenu">
            {item.children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                end
                className={({ isActive }) =>
                  `sidebar-sublink ${isActive ? "active" : ""}`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <Icon size={18} className="sidebar-icon" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo-container">
          <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5C50 5 85 15 85 45C85 75 50 95 50 95C50 95 15 75 15 45C15 15 50 5 50 5Z" fill="url(#logo-grad)" stroke="#ffffff" strokeWidth="2"/>
            {/* Bat */}
            <path d="M35 75L68 30C69 28.5 71.5 28.5 72.5 30C73.5 31.5 73.5 34 72 35L39 80L35 75Z" fill="#ffffff" />
            <path d="M68 30L73.5 22.5C74.5 21 76.5 22.5 75.5 24L70 31.5L68 30Z" fill="#ff7a00" stroke="#ffffff" strokeWidth="1" />
            {/* Ball */}
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
          <p>SUPER ADMIN</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {SUPER_ADMIN_SIDEBAR.map((group) => (
          <div key={group.title} className="sidebar-section">
            <p className="sidebar-section-title">{group.title}</p>
            {group.items.map((item) => (
              <SidebarLink key={item.path} item={item} />
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
