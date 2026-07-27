// src/components/dashboard/Header.tsx

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { getCurrentUser, logoutUser } from "../../data/account";
import { ROLE_LABELS } from "../../constants/roles";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pageHeader } = useAppSelector((state) => state.ui);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const { title, breadcrumb } = pageHeader;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setOpen(false);
    navigate("/", { replace: true });
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

            <div className="header-user-info">
              <h4>{user?.name || "User"}</h4>
              <span>{user?.email || ""}</span>
            </div>
            <ChevronDown size={16} className={`header-user-caret ${open ? "open" : ""}`} />
          </button>

          {open && (
            <div className="header-user-menu">
              <div className="header-user-menu-title">Account</div>
              <div className="px-3 py-2 text-xs text-[var(--text-muted)] border-b border-[var(--border-soft)]">
                <p className="font-semibold text-[var(--text-primary)]">{user?.name}</p>
                <p className="mt-0.5">{user?.email}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide">
                  {user?.role ? ROLE_LABELS[user.role] : ""}
                </p>
              </div>
              <button
                type="button"
                className="header-role-option w-full"
                onClick={handleLogout}
              >
                <span className="flex items-center gap-2">
                  <LogOut size={16} />
                  <strong>Logout</strong>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
