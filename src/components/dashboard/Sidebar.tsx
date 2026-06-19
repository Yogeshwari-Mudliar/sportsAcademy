// src/components/dashboard/Sidebar.tsx

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
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
        <div className="sidebar-brand-logo">
          <span className="sidebar-brand-mark">C</span>
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
    </aside>
  );
}
