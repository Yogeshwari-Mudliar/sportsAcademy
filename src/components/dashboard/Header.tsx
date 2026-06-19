// src/components/dashboard/Header.tsx

import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSidebar } from "../../features/ui/uiSlice";

interface StoredUser {
  name?: string;
  email?: string;
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
  const { title, breadcrumb } = useAppSelector((state) => state.ui.pageHeader);
  const user = getStoredUser();

  return (
    <header className="dashboard-header">
      <div className="header-left">
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
          <input type="text" placeholder="Search anything..." />
          <Search size={18} />
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">8</span>
        </button>

        <div className="header-user">
          <img src="https://i.pravatar.cc/100?img=12" alt="User" />
          <div className="header-user-info">
            <h4>{user.name || "Super Admin"}</h4>
            <span>{user.email || "superadmin@ca.com"}</span>
          </div>
          <ChevronDown size={16} className="header-user-caret" />
        </div>
      </div>
    </header>
  );
}
