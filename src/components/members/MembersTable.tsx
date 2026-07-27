import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import TableImportExport from "@/components/table/TableImportExport";
import StatusDot from "@/components/table/StatusDot";
import { MemberFormModal, MemberViewModal } from "@/components/members/MemberCrudModals";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAcademyById } from "@/data/academies";
import {
  MEMBERS_UPDATED_EVENT,
  addAcademyMember,
  assignMemberBatch,
  bulkAddAcademyMembers,
  getAcademyMembers,
  setAcademyMemberStatus,
  updateAcademyMember,
  type AcademyMember,
  type AcademyMemberRole,
  type MemberStatus,
} from "@/data/academyMembers";
import {
  getBatchesByAcademy,
  syncBatchEnrolledCounts,
  type Batch,
} from "@/data/batches";
import { downloadCsv, parseCsv, readFileAsText, toCsv } from "@/utils/csv";
import { truncateText } from "@/utils/display";

const ROLE_LABELS: Record<AcademyMemberRole, string> = {
  student: "Student",
  coach: "Coach",
  admin: "Admin",
  accessory: "Accessory",
};

interface MembersTableProps {
  memberRole: AcademyMemberRole;
  getMembers: () => AcademyMember[];
  title?: string;
  subtitle?: string;
  showAcademyColumn?: boolean;
  showLocationColumn?: boolean;
  defaultAcademyId?: number;
  academyOptions?: { id: number; label: string }[];
  pageSize?: number;
  enableBatchAssign?: boolean;
}

export default function MembersTable({
  memberRole,
  getMembers,
  title,
  subtitle,
  showAcademyColumn = false,
  showLocationColumn = true,
  defaultAcademyId,
  academyOptions,
  pageSize = 10,
  enableBatchAssign,
}: MembersTableProps) {
  const canManage = useCanManageTables();
  const canAssignBatch = enableBatchAssign ?? memberRole === "student";
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [viewing, setViewing] = useState<AcademyMember | null>(null);
  const [editing, setEditing] = useState<AcademyMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [assigning, setAssigning] = useState<AcademyMember | null>(null);
  const [importMsg, setImportMsg] = useState("");

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener(MEMBERS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(MEMBERS_UPDATED_EVENT, handler);
  }, []);

  const members = useMemo(() => getMembers(), [getMembers, tick]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return members.filter((m) => {
      const matchesSearch =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.phone.includes(query) ||
        (m.batchName ?? "").toLowerCase().includes(query) ||
        getAcademyById(m.academyId)?.name.toLowerCase().includes(query) ||
        getAcademyById(m.academyId)?.city.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, memberRole, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const refreshBatchCounts = () => {
    syncBatchEnrolledCounts(() =>
      getAcademyMembers()
        .filter((m) => m.role === "student")
        .map((m) => m.batchId)
    );
  };

  const handleToggleStatus = (member: AcademyMember) => {
    const nextStatus: MemberStatus = member.status === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this ${ROLE_LABELS[memberRole].toLowerCase()}?`)) {
      return;
    }
    setAcademyMemberStatus(member.id, nextStatus);
    setViewing((v) => (v?.id === member.id ? { ...v, status: nextStatus } : v));
  };

  const handleAssignBatch = (member: AcademyMember, batch: Batch | null) => {
    assignMemberBatch(
      member.id,
      batch ? { id: batch.id, name: batch.name } : null
    );
    refreshBatchCounts();
    setAssigning(null);
    setTick((t) => t + 1);
  };

  const handleExport = () => {
    const headers = [
      "name",
      "email",
      "phone",
      "status",
      "academyId",
      "joinedOn",
      "batchName",
    ];
    const rows = filtered.map((m) => ({
      name: m.name,
      email: m.email,
      phone: m.phone,
      status: m.status,
      academyId: m.academyId,
      joinedOn: m.joinedOn,
      batchName: m.batchName ?? "",
    }));
    downloadCsv(
      `${ROLE_LABELS[memberRole].toLowerCase()}s-export.csv`,
      toCsv(headers, rows)
    );
  };

  const handleImport = async (file: File) => {
    try {
      const text = await readFileAsText(file);
      const { rows } = parseCsv(text);
      if (!rows.length) {
        setImportMsg("No rows found in CSV.");
        return;
      }

      const fallbackAcademyId =
        defaultAcademyId ?? academyOptions?.[0]?.id ?? members[0]?.academyId;

      const prepared = rows
        .map((row) => {
          const name = (row.name || row.fullname || "").trim();
          const email = (row.email || row.Email || "").trim();
          const phone = (row.phone || row.mobile || row.Phone || "").trim();
          if (!name || !email || !phone) return null;
          const academyId = Number(row.academyid || row.academyId || fallbackAcademyId);
          const statusRaw = (row.status || "Active").trim();
          const status: MemberStatus = statusRaw.toLowerCase() === "inactive" ? "Inactive" : "Active";
          return {
            academyId: Number.isFinite(academyId) ? academyId : fallbackAcademyId!,
            role: memberRole,
            name,
            email,
            phone,
            status,
            batchId: null,
            batchName: "",
          };
        })
        .filter(Boolean) as Array<
        Omit<AcademyMember, "id" | "avatar" | "joinedOn">
      >;

      if (!prepared.length) {
        setImportMsg("CSV must include name, email and phone columns.");
        return;
      }

      bulkAddAcademyMembers(prepared);
      setImportMsg(`Imported ${prepared.length} ${ROLE_LABELS[memberRole].toLowerCase()}(s).`);
      setTick((t) => t + 1);
    } catch {
      setImportMsg("Failed to import CSV. Please check the file format.");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setImportMsg("");
  };

  const displayTitle = title ?? `${ROLE_LABELS[memberRole]}s`;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">{displayTitle}</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {subtitle ?? `${filtered.length} records`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TableImportExport
            show={canManage}
            onExport={handleExport}
            onImportFile={handleImport}
          />
          <TableAddButton
            label={`Add ${ROLE_LABELS[memberRole]}`}
            show={canManage}
            onClick={() => setAdding(true)}
          />
        </div>
      </div>

      {importMsg && (
        <div className="mb-3 text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
          {importMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative w-full sm:flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder={`Search ${displayTitle.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none"
          />
          <Search size={15} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto h-9 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          type="button"
          onClick={handleReset}
          className="h-9 px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 inline-flex items-center justify-center gap-1"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-400 font-medium text-sm">No records found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="lg:hidden flex flex-col gap-3">
            {paginated.map((member) => {
              const academy = getAcademyById(member.academyId);
              const academyName = academy?.name ?? "—";
              return (
                <li
                  key={member.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.avatar}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                          {member.name}
                        </p>
                        <StatusDot status={member.status} className="shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 break-all">{member.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{member.phone}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                        {showAcademyColumn && <span>{truncateText(academyName, 28)}</span>}
                        {showLocationColumn && academy?.city && <span>{academy.city}</span>}
                        {canAssignBatch && (
                          <span>{member.batchName || "No batch"}</span>
                        )}
                        <span>Joined {member.joinedOn}</span>
                      </div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                      <TableRowActions
                        onView={() => setViewing(member)}
                        onEdit={() => setEditing(member)}
                        onToggleStatus={() => handleToggleStatus(member)}
                        onAssignBatch={
                          canAssignBatch ? () => setAssigning(member) : undefined
                        }
                        isActive={member.status === "Active"}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop table */}
          <div className="hidden lg:block w-full overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className={`py-3 px-2 ${showAcademyColumn ? "w-[18%]" : "w-[22%]"}`}>Name</th>
                  {showAcademyColumn && <th className="py-3 px-2 w-[16%]">Academy</th>}
                  {showLocationColumn && <th className="py-3 px-2 w-[10%]">Location</th>}
                  {canAssignBatch && <th className="py-3 px-2 w-[12%]">Batch</th>}
                  <th className="py-3 px-2 w-[18%]">Email</th>
                  <th className="py-3 px-2 w-[12%]">Phone</th>
                  <th className="py-3 px-2 w-[10%]">Joined On</th>
                  {canManage && <th className="py-3 px-2 w-[6%] text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginated.map((member) => {
                  const academy = getAcademyById(member.academyId);
                  const academyName = academy?.name ?? "—";
                  return (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-2 overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={member.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border shrink-0"
                          />
                          <span
                            className="font-semibold truncate flex-1 min-w-0"
                            title={member.name}
                          >
                            {member.name}
                          </span>
                          <StatusDot status={member.status} className="shrink-0" />
                        </div>
                      </td>
                      {showAcademyColumn && (
                        <td className="py-3 px-2 text-gray-600 overflow-hidden">
                          <span className="block truncate" title={academyName}>
                            {truncateText(academyName, 24)}
                          </span>
                        </td>
                      )}
                      {showLocationColumn && (
                        <td className="py-3 px-2 text-gray-600 overflow-hidden">
                          <span className="block truncate" title={academy?.city}>
                            {academy?.city ?? "—"}
                          </span>
                        </td>
                      )}
                      {canAssignBatch && (
                        <td className="py-3 px-2 text-gray-600 overflow-hidden">
                          {member.batchName ? (
                            <span className="block truncate" title={member.batchName}>
                              {member.batchName}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </td>
                      )}
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate" title={member.email}>
                          {member.email}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate" title={member.phone}>
                          {member.phone}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate">{member.joinedOn}</span>
                      </td>
                      {canManage && (
                        <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <TableRowActions
                            onView={() => setViewing(member)}
                            onEdit={() => setEditing(member)}
                            onToggleStatus={() => handleToggleStatus(member)}
                            onAssignBatch={
                              canAssignBatch ? () => setAssigning(member) : undefined
                            }
                            isActive={member.status === "Active"}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={rowsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setRowsPerPage(size);
              setCurrentPage(1);
            }}
            label="records"
          />
        </>
      )}

      {viewing && (
        <MemberViewModal
          member={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
      )}

      {editing && (
        <MemberFormModal
          mode="edit"
          memberRole={memberRole}
          initial={editing}
          defaultAcademyId={defaultAcademyId ?? editing.academyId}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            updateAcademyMember(editing.id, data);
            setEditing(null);
            setTick((t) => t + 1);
          }}
        />
      )}

      {adding && (defaultAcademyId || academyOptions?.length) && (
        <MemberFormModal
          mode="add"
          memberRole={memberRole}
          academyOptions={academyOptions}
          defaultAcademyId={defaultAcademyId ?? academyOptions?.[0]?.id}
          onClose={() => setAdding(false)}
          onSave={(data) => {
            addAcademyMember({
              academyId: data.academyId ?? defaultAcademyId ?? academyOptions![0].id,
              role: memberRole,
              name: data.name,
              email: data.email,
              phone: data.phone,
              status: data.status,
              dateOfBirth: data.dateOfBirth,
              gender: data.gender,
              bloodGroup: data.bloodGroup,
              parentName: data.parentName,
              parentPhone: data.parentPhone,
              playingRole: data.playingRole,
              sportExperience: data.sportExperience,
              address: data.address,
              city: data.city,
            });
            setAdding(false);
          }}
        />
      )}

      {assigning && (
        <AssignBatchModal
          member={assigning}
          onClose={() => setAssigning(null)}
          onAssign={(batch) => handleAssignBatch(assigning, batch)}
        />
      )}
    </div>
  );
}

function AssignBatchModal({
  member,
  onClose,
  onAssign,
}: {
  member: AcademyMember;
  onClose: () => void;
  onAssign: (batch: Batch | null) => void;
}) {
  const batches = getBatchesByAcademy(member.academyId, true);
  const [batchId, setBatchId] = useState<string>(
    member.batchId ? String(member.batchId) : ""
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Assign Batch</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Assign a batch for <strong>{member.name}</strong> at this academy.
        </p>
        <label className="text-xs font-semibold uppercase text-gray-500">Batch</label>
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm"
        >
          <option value="">Not assigned</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name} · {batch.timing} ({batch.enrolled}/{batch.capacity})
            </option>
          ))}
        </select>
        {batches.length === 0 && (
          <p className="mt-2 text-xs text-amber-600">
            No active batches found for this academy. Create a batch first.
          </p>
        )}
        <div className="flex justify-end gap-2 pt-5">
          <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold"
            onClick={() => {
              const selected = batches.find((b) => String(b.id) === batchId) ?? null;
              onAssign(selected);
            }}
          >
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
