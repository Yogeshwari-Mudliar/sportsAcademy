// src/components/dashboard/Header.tsx

import { useSelector } from "react-redux";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const user = useSelector(
    (state: any) => state.auth.user
  );

  return (
    <header className="dashboard-header">
      <div className="header-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="header-user">
          <img
            src="https://i.pravatar.cc/100"
            alt="User"
          />

          <div>
            <h4>{user?.name || "Super Admin"}</h4>
            <span>
              {user?.email ||
                "superadmin@academy.com"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}