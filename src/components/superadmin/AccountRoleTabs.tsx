import { ROLE_LABELS, type Role } from "@/constants/roles";

interface AccountRoleTabsProps {
  roles: Role[];
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function AccountRoleTabs({
  roles,
  activeRole,
  onRoleChange,
}: AccountRoleTabsProps) {
  if (roles.length <= 1) return null;

  return (
    <div className="account-tabs" role="tablist" aria-label="User role tabs">
      {roles.map((role) => {
        const active = activeRole === role;
        return (
          <button
            key={role}
            type="button"
            role="tab"
            aria-selected={active}
            className={`account-tab ${active ? "active" : ""}`}
            onClick={() => onRoleChange(role)}
          >
            {ROLE_LABELS[role]}
          </button>
        );
      })}
    </div>
  );
}
