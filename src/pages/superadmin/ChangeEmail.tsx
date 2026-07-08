import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import SuperAdminTable from "../../components/superadmin/SuperAdminTable";
import {
  getSuperAdmins,
  updateAdminEmail,
  validateEmail,
} from "../../data/account";
import "../../styles/superadmin/account.css";

export default function ChangeEmail() {
  const dispatch = useAppDispatch();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errors, setErrors] = useState({
    selection: "",
    newEmail: "",
    confirmEmail: "",
    form: "",
  });
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedAdmin = useMemo(() => {
    if (selectedIds.length !== 1) return null;
    return getSuperAdmins().find((a) => a.id === selectedIds[0]) ?? null;
  }, [selectedIds]);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Change Email",
        breadcrumb: ["Dashboard", "Change Email"],
      })
    );
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    const selectionError =
      selectedIds.length !== 1 ? "Select one super admin from the table." : "";
    const newEmailError = validateEmail(newEmail);
    let confirmEmailError = "";
    if (!confirmEmail.trim()) {
      confirmEmailError = "Please confirm the new email";
    } else if (confirmEmail.trim().toLowerCase() !== newEmail.trim().toLowerCase()) {
      confirmEmailError = "Email addresses do not match";
    }

    setErrors({
      selection: selectionError,
      newEmail: newEmailError,
      confirmEmail: confirmEmailError,
      form: "",
    });

    if (selectionError || newEmailError || confirmEmailError || !selectedAdmin) return;

    setSubmitting(true);
    const result = updateAdminEmail(selectedAdmin.id, newEmail.trim());
    setSubmitting(false);

    if (!result.success) {
      setErrors((prev) => ({ ...prev, form: result.error }));
      return;
    }

    setSuccess(`Email updated for ${result.user.name}.`);
    setNewEmail("");
    setConfirmEmail("");
    setSelectedIds([]);
  };

  return (
    <div className="dashboard-page account-page-wide">
      <div className="account-layout">
        <section className="account-panel">
          <h2 className="account-panel-title">Super Admin List</h2>
          <p className="account-help">
            Select one super admin from the table to change their email address.
          </p>

          <SuperAdminTable
            mode="single"
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
          {errors.selection && (
            <p className="account-error account-error-block">{errors.selection}</p>
          )}
        </section>

        <section className="account-panel">
          <h2 className="account-panel-title">Update Email</h2>

          {selectedAdmin ? (
            <div className="account-current">
              <span className="account-current-label">Selected admin</span>
              <span className="account-current-value">{selectedAdmin.name}</span>
              <span className="account-current-label">Current email</span>
              <span className="account-current-value">{selectedAdmin.email}</span>
            </div>
          ) : (
            <p className="account-help">Select a super admin from the table to continue.</p>
          )}

          <form onSubmit={handleSubmit}>
            {success && <div className="account-success">{success}</div>}
            {errors.form && <p className="account-error account-error-block">{errors.form}</p>}

            <div className="account-field">
              <label className="account-label" htmlFor="new-email">
                New Email<span className="account-required">*</span>
              </label>
              <input
                id="new-email"
                type="email"
                className="account-input"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!selectedAdmin}
              />
              {errors.newEmail && (
                <span className="account-error">{errors.newEmail}</span>
              )}
            </div>

            <div className="account-field">
              <label className="account-label" htmlFor="confirm-email">
                Confirm New Email<span className="account-required">*</span>
              </label>
              <input
                id="confirm-email"
                type="email"
                className="account-input"
                placeholder="Re-enter new email address"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                disabled={!selectedAdmin}
              />
              {errors.confirmEmail && (
                <span className="account-error">{errors.confirmEmail}</span>
              )}
            </div>

            <div className="account-actions">
              <button
                type="button"
                className="account-btn account-btn-ghost"
                onClick={() => {
                  setSelectedIds([]);
                  setNewEmail("");
                  setConfirmEmail("");
                  setSuccess("");
                  setErrors({
                    selection: "",
                    newEmail: "",
                    confirmEmail: "",
                    form: "",
                  });
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="account-btn account-btn-primary"
                disabled={submitting || !selectedAdmin}
              >
                <Save size={16} />
                Update Email
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
