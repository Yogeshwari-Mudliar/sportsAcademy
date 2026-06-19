// src/components/dashboard/MenuItem.tsx

import { NavLink } from "react-router-dom";

interface MenuItemProps {
  label: string;
  path: string;
}

export default function MenuItem({
  label,
  path,
}: MenuItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      {label}
    </NavLink>
  );
}