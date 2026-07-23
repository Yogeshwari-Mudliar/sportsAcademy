import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import { MemberFormModal, MemberViewModal } from "@/components/members/MemberCrudModals";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAcademyById } from "@/data/academies";
import {
  MEMBERS_UPDATED_EVENT,
  addAcademyMember,
  setAcademyMemberStatus,
  updateAcademyMember,
  type AcademyMember,
  type AcademyMemberRole,
  type MemberStatus,
} from "@/data/academyMembers";

const ROLE_LABELS: Record<AcademyMemberRole, string> = {
  student: "Student",
  coach: "Coach",
  admin: "Admin",
  accessory: "Accessory",
};

const statusStyles: Record<MemberStatus, string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
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
}: MembersTableProps) {
  const canManage = useCanManageTables();
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [viewing, setViewing] = useState<AcademyMember | null>(null);
  const [editing, setEditing] = useState<AcademyMember | null>(null);
  const [adding, setAdding] = useState(false);

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

  const handleToggleStatus = (member: AcademyMember) => {
    const nextStatus: MemberStatus = member.status === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this ${ROLE_LABELS[memberRole].toLowerCase()}?`)) {
      return;
    }
    setAcademyMemberStatus(member.id, nextStatus);
    setViewing((v) => (v?.id === member.id ? { ...v, status: nextStatus } : v));
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
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
        <TableAddButton
          label={`Add ${ROLE_LABELS[memberRole]}`}
          show={canManage}
          onClick={() => setAdding(true)}
        />
      </div>

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
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-3">Name</th>
                  {showAcademyColumn && <th className="py-3 px-3">Academy</th>}
                  {showLocationColumn && <th className="py-3 px-3">Location</th>}
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Joined On</th>
                  <th className="py-3 px-3">Status</th>
                  {canManage && <th className="py-3 px-3 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginated.map((member) => {
                  const academy = getAcademyById(member.academyId);
                  return (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt="" className="w-9 h-9 rounded-full object-cover border" />
                          <span className="font-semibold">{member.name}</span>
                        </div>
                      </td>
                      {showAcademyColumn && (
                        <td className="py-3 px-3 text-gray-600">{academy?.name ?? "—"}</td>
                      )}
                      {showLocationColumn && (
                        <td className="py-3 px-3 text-gray-600">{academy?.city ?? "—"}</td>
                      )}
                      <td className="py-3 px-3 text-gray-600">{member.email}</td>
                      <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{member.phone}</td>
                      <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{member.joinedOn}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[member.status]}`}>
                          {member.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <TableRowActions
                            onView={() => setViewing(member)}
                            onEdit={() => setEditing(member)}
                            onToggleStatus={() => handleToggleStatus(member)}
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
            });
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}
