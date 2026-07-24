import { useEffect, useState } from "react";
import { RotateCcw, Save, ShieldCheck } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import { ROLE_LABELS, ROLES, type Role } from "../../constants/roles";
import {
  PERMISSION_MODULES,
  getRolePermissions,
  resetRolePermissions,
  updateRolePermissions,
  type PermissionKey,
} from "../../data/permissions";
import "../../styles/superadmin/rolesPermissions.css";

const EDITABLE_ROLES: Role[] = [ROLES.admin, ROLES.coach, ROLES.student];

export default function RolesPermissions() {
  const dispatch = useAppDispatch();
  const [activeRole, setActiveRole] = useState<Role>(ROLES.admin);
  const [permissions, setPermissions] = useState<Record<Role, PermissionKey[]>>(
    () => getRolePermissions()
  );
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Roles & Permissions",
        breadcrumb: ["Dashboard", "Roles & Permissions"],
      })
    );
  }, [dispatch]);

  const selectedPermissions = permissions[activeRole];

  const togglePermission = (permission: PermissionKey) => {
    if (permission === "dashboard") return;

    setSuccess("");
    setPermissions((current) => {
      const rolePermissions = current[activeRole];
      const nextRolePermissions = rolePermissions.includes(permission)
        ? rolePermissions.filter((item) => item !== permission)
        : [...rolePermissions, permission];

      return {
        ...current,
        [activeRole]: nextRolePermissions,
      };
    });
  };

  const handleSave = () => {
    updateRolePermissions(activeRole, permissions[activeRole]);
    setPermissions(getRolePermissions());
    setSuccess(`${ROLE_LABELS[activeRole]} permissions updated.`);
  };

  const handleReset = () => {
    resetRolePermissions();
    setPermissions(getRolePermissions());
    setSuccess("Default permissions restored.");
  };

  return (
    <div className="dashboard-page roles-page">
      <section className="roles-panel">
        <div className="roles-header">
          <div>
            <h2>Role Access Control</h2>
            <p>Select a role and enable the modules that role can access.</p>
          </div>
          <button type="button" className="roles-reset-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="roles-tabs">
          {EDITABLE_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              className={`roles-tab ${activeRole === role ? "active" : ""}`}
              onClick={() => {
                setActiveRole(role);
                setSuccess("");
              }}
            >
              <ShieldCheck size={16} />
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        <div className="permissions-grid">
          {PERMISSION_MODULES.map((module) => {
            const checked = selectedPermissions.includes(module.key);
            return (
              <label
                key={module.key}
                className={`permission-card ${checked ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={module.key === "dashboard"}
                  onChange={() => togglePermission(module.key)}
                />
                <span className="permission-switch" aria-hidden="true" />
                <span>
                  <strong>{module.label}</strong>
                  <small>{module.description}</small>
                </span>
              </label>
            );
          })}
        </div>

        {success && <div className="roles-success">{success}</div>}

        <div className="roles-actions">
          <button type="button" className="roles-save-btn" onClick={handleSave}>
            <Save size={16} />
            Save Permissions
          </button>
        </div>
      </section>
    </div>
  );
}
