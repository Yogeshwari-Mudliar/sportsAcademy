// src/components/dashboard/Header.tsx

import { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronDown, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { getStoredUsers } from "../../data/account";
import { ROLE_HOME_PATHS, ROLE_LABELS, ROLES, type Role } from "../../constants/roles";

interface StoredUser {
  id?: number;
  name?: string;
  email?: string;
  role?: Role;
}

function getStoredUser(): StoredUser {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as StoredUser) : {};
  } catch {
    return {};
  }
}

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pageHeader, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<StoredUser>(() => getStoredUser());
  const userMenuRef = useRef<HTMLDivElement | null>(null);

const { title, breadcrumb } = pageHeader;
  const roles: Role[] = [ROLES.superadmin, ROLES.admin, ROLES.coach, ROLES.student];

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchRole = (role: Role) => {
    const nextUser = getStoredUsers().find((item) => item.role === role);
    if (!nextUser) return;

    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
    setOpen(false);
    navigate(ROLE_HOME_PATHS[role], { replace: true });
  };

  return (
    <header className="dashboard-header ">
      <div className="header-left ">
        <button
          type="button"
          className="header-menu-btn"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-title">
          <h2>{title}</h2>
          <nav className="header-breadcrumb">
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb}-${i}`}>
                {i > 0 && <span className="crumb-sep">›</span>}
                {crumb}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={18} className="header-search-icon" />
          <input type="text" placeholder="Search anything..." />
          <kbd className="header-search-shortcut">⌘K</kbd>
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">8</span>
        </button>

        <div className="header-user-wrap" ref={userMenuRef}>
          <button
            type="button"
            className="header-user"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            <img src="https://i.pravatar.cc/100?img=12" alt="User" />

            {sidebarCollapsed && (
              <div className="header-user-info">
                <h4>{user.name || "Superadmin User"}</h4>
                <span>{user.email || "superadmin@sportsacademy.com"}</span>
              </div>
            )}
            <ChevronDown size={16} className={`header-user-caret ${open ? "open" : ""}`} />
          </button>

          {open && (
            <div className="header-user-menu">
              <div className="header-user-menu-title">Switch Role</div>
              {roles.map((role) => {
                const active = user.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    className={`header-role-option ${active ? "active" : ""}`}
                    onClick={() => switchRole(role)}
                  >
                    <span>
                      <strong>{ROLE_LABELS[role]}</strong>
                      <small>{getStoredUsers().find((item) => item.role === role)?.email}</small>
                    </span>
                    {active && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
