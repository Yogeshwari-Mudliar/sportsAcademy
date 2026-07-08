import { useCallback, useEffect, useState } from "react";
import type { AccountUser } from "@/data/account";
import { ACCOUNT_UPDATED_EVENT, getSuperAdmins } from "@/data/account";

interface SuperAdminTableProps {
  mode: "single" | "multiple";
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export default function SuperAdminTable({
  mode,
  selectedIds,
  onSelectionChange,
}: SuperAdminTableProps) {
  const [admins, setAdmins] = useState<AccountUser[]>(() => getSuperAdmins());

  const refresh = useCallback(() => {
    setAdmins(getSuperAdmins());
  }, []);

  useEffect(() => {
    window.addEventListener(ACCOUNT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACCOUNT_UPDATED_EVENT, refresh);
  }, [refresh]);

  const allSelected =
    admins.length > 0 && admins.every((a) => selectedIds.includes(a.id));

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      onSelectionChange([]);
      return;
    }
    onSelectionChange(admins.map((a) => a.id));
  };

  const handleToggle = (id: number) => {
    if (mode === "single") {
      onSelectionChange(selectedIds.includes(id) ? [] : [id]);
      return;
    }

    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (admins.length === 0) {
    return (
      <div className="account-empty-table">
        No super admin accounts found.
      </div>
    );
  }

  return (
    <div className="account-table-wrap">
      <table className="account-table">
        <thead>
          <tr>
            <th className="account-table-check">
              {mode === "multiple" ? (
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all super admins"
                />
              ) : (
                "Select"
              )}
            </th>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => {
            const selected = selectedIds.includes(admin.id);
            return (
              <tr
                key={admin.id}
                className={selected ? "selected" : ""}
                onClick={() => handleToggle(admin.id)}
              >
                <td className="account-table-check" onClick={(e) => e.stopPropagation()}>
                  <input
                    type={mode === "single" ? "radio" : "checkbox"}
                    name={mode === "single" ? "superadmin-select" : undefined}
                    checked={selected}
                    onChange={() => handleToggle(admin.id)}
                    aria-label={`Select ${admin.name}`}
                  />
                </td>
                <td>{index + 1}</td>
                <td className="account-table-name">{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.mobile}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
