// src/components/dashboard/Sidebar.tsx

import { useSelector } from "react-redux";
import { SIDEBAR_CONFIG } from "../../constants/sidebar";
import MenuItem from "./MenuItem";
import "../../styles/common/sidebar.css";

export default function Sidebar() {
  const role = useSelector(
    (state: any) => state.auth.user?.role
  );

  const menu =
    SIDEBAR_CONFIG[
      role as keyof typeof SIDEBAR_CONFIG
    ] || [];

  return (
    <aside className="sidebar">
      <h2>Sports Academy</h2>

      {menu.map((item) => (
        <MenuItem
          key={item.path}
          label={item.label}
          path={item.path}
        />
      ))}
    </aside>
  );
}