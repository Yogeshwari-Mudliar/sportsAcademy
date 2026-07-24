import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ROLE_LABELS, type Role } from "@/constants/roles";
import type { AccountUser } from "@/data/account";
import { ACCOUNT_UPDATED_EVENT, getManageableAccountUsers } from "@/data/account";

interface SuperAdminTableProps {
  mode: "single" | "multiple";
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  roleFilter?: Role;
}

export default function SuperAdminTable({
  mode,
  selectedIds,
  onSelectionChange,
  roleFilter,
}: SuperAdminTableProps) {
  const [admins, setAdmins] = useState<AccountUser[]>(() => getManageableAccountUsers());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const refresh = useCallback(() => {
    setAdmins(getManageableAccountUsers());
  }, []);

  useEffect(() => {
    window.addEventListener(ACCOUNT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACCOUNT_UPDATED_EVENT, refresh);
  }, [refresh]);

  const filteredAdmins = useMemo(
    () => admins.filter((admin) => !roleFilter || admin.role === roleFilter),
    [admins, roleFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / pageSize));
  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAdmins.slice(start, start + pageSize);
  }, [filteredAdmins, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const allSelected =
    filteredAdmins.length > 0 && filteredAdmins.every((a) => selectedIds.includes(a.id));

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      onSelectionChange([]);
      return;
    }
    onSelectionChange(filteredAdmins.map((a) => a.id));
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

  if (filteredAdmins.length === 0) {
    return (
      <div className="account-empty-table">
        No manageable accounts found.
      </div>
    );
  }

  return (
    <div>
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
                    aria-label="Select all users"
                  />
                ) : (
                  "Select"
                )}
              </th>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAdmins.map((admin, index) => {
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
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="account-table-name">{admin.name}</td>
                  <td>{ROLE_LABELS[admin.role]}</td>
                  <td>{admin.email}</td>
                  <td>{admin.mobile}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="account-pagination">
        <span className="account-pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <div className="account-pagination-actions">
          <button
            type="button"
            className="account-page-btn"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <button
            type="button"
            className="account-page-btn"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
