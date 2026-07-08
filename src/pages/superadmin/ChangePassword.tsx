import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import SuperAdminTable from "../../components/superadmin/SuperAdminTable";
import {
  getSuperAdmins,
  updateAdminPasswords,
  validatePasswordStrength,
} from "../../data/account";
import "../../styles/superadmin/account.css";

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    selection: "",
    newPassword: "",
    confirmPassword: "",
    form: "",
  });
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedAdmins = useMemo(
    () => getSuperAdmins().filter((a) => selectedIds.includes(a.id)),
    [selectedIds]
  );

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Change Password",
        breadcrumb: ["Dashboard", "Change Password"],
      })
    );
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    const selectionError =
      selectedIds.length === 0
        ? "Select at least one super admin, or use Select All."
        : "";
    const newPasswordError = validatePasswordStrength(newPassword);
    let confirmPasswordError = "";
    if (!confirmPassword) {
      confirmPasswordError = "Please confirm the new password";
    } else if (confirmPassword !== newPassword) {
      confirmPasswordError = "Passwords do not match";
    }

    setErrors({
      selection: selectionError,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
      form: "",
    });

    if (selectionError || newPasswordError || confirmPasswordError) return;

    setSubmitting(true);
    const result = updateAdminPasswords(selectedIds, newPassword);
    setSubmitting(false);

    if (!result.success) {
      setErrors((prev) => ({ ...prev, form: result.error }));
      return;
    }

    setSuccess(
      `Password updated for ${result.count} super admin${result.count > 1 ? "s" : ""}.`
    );
    setNewPassword("");
    setConfirmPassword("");
    setSelectedIds([]);
  };

  return (
    <div className="dashboard-page account-page-wide">
      <div className="account-layout">
        <section className="account-panel">
          <h2 className="account-panel-title">Super Admin List</h2>
          <p className="account-help">
            Select one or more super admins. Use Select All to apply the same
            password to everyone.
          </p>

          <SuperAdminTable
            mode="multiple"
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
          {errors.selection && (
            <p className="account-error account-error-block">{errors.selection}</p>
          )}

          {selectedAdmins.length > 0 && (
            <div className="account-selected-list">
              <span className="account-current-label">
                Selected ({selectedAdmins.length})
              </span>
              <div className="account-selected-chips">
                {selectedAdmins.map((admin) => (
                  <span key={admin.id} className="account-chip">
                    {admin.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="account-panel">
          <h2 className="account-panel-title">Set New Password</h2>
          <p className="account-help">
            The same new password will be applied to all selected super admins.
          </p>

          <form onSubmit={handleSubmit}>
            {success && <div className="account-success">{success}</div>}
            {errors.form && <p className="account-error account-error-block">{errors.form}</p>}

            <div className="account-field">
              <label className="account-label" htmlFor="new-password">
                New Password<span className="account-required">*</span>
              </label>
              <div className="account-input-wrap">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  className="account-input with-toggle"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="account-toggle-btn"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="account-error">{errors.newPassword}</span>
              )}
            </div>

            <div className="account-field">
              <label className="account-label" htmlFor="confirm-password">
                Confirm New Password<span className="account-required">*</span>
              </label>
              <div className="account-input-wrap">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  className="account-input with-toggle"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="account-toggle-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="account-error">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="account-actions">
              <button
                type="button"
                className="account-btn account-btn-ghost"
                onClick={() => {
                  setSelectedIds([]);
                  setNewPassword("");
                  setConfirmPassword("");
                  setSuccess("");
                  setErrors({
                    selection: "",
                    newPassword: "",
                    confirmPassword: "",
                    form: "",
                  });
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="account-btn account-btn-primary"
                disabled={submitting}
              >
                <KeyRound size={16} />
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
