import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Plus,
  MapPin,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  ACADEMY_TYPES,
  type AcademyListItem,
  type AcademyStatus,
} from "@/types/academy";
import {
  getAcademies,
  updateAcademyStatus,
} from "@/data/academies";
import AcademyViewModal from "./AcademyViewModal";
import AcademyEditModal from "./AcademyEditModal";
import TableRowActions from "@/components/table/TableRowActions";
import TablePagination from "@/components/table/TablePagination";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const statusStyles: Record<AcademyStatus, string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
};

export default function AcademyList({
  detailBasePath = "/superadmin/academies",
  filterByBrandId,
  showCreateButton = true,
  showAddLocationButton = false,
  addLocationPath = "/admin/academies/add-location",
}: {
  detailBasePath?: string;
  filterByBrandId?: number;
  showCreateButton?: boolean;
  showAddLocationButton?: boolean;
  addLocationPath?: string;
} = {}) {
  const navigate = useNavigate();
  const canManage = useCanManageTables();
  const [academies, setAcademies] = useState<AcademyListItem[]>(() => getAcademies());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewing, setViewing] = useState<AcademyListItem | null>(null);
  const [editing, setEditing] = useState<AcademyListItem | null>(null);

  const refresh = useCallback(() => {
    setAcademies(getAcademies());
  }, []);

  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener("academiesUpdated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("academiesUpdated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const handleReset = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
  };

  const filteredAcademies = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return academies.filter((academy) => {
      const matchesSearch = !query || academy.name.toLowerCase().includes(query);
      const matchesType = !typeFilter || academy.type === typeFilter;
      const matchesStatus = !statusFilter || academy.status === statusFilter;
      const matchesScope =
        filterByBrandId === undefined || academy.brandId === filterByBrandId;
      return matchesSearch && matchesType && matchesStatus && matchesScope;
    });
  }, [academies, debouncedSearch, typeFilter, statusFilter, filterByBrandId]);

  const totalPages = Math.max(1, Math.ceil(filteredAcademies.length / pageSize));
  const paginatedAcademies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAcademies.slice(start, start + pageSize);
  }, [filteredAcademies, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter, statusFilter, filterByBrandId, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleOpenAcademy = (id: number) => {
    navigate(`${detailBasePath}/${id}/students`);
  };

  const handleEdit = (id: number) => {
    const academy = academies.find((a) => a.id === id);
    if (!academy) return;
    setViewing(null);
    setEditing(academy);
  };

  const handleView = (academy: AcademyListItem) => {
    setViewing(academy);
  };

  const handleToggleStatus = (academy: AcademyListItem) => {
    const nextStatus: AcademyStatus = academy.status === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this academy?`)) return;
    setAcademies(updateAcademyStatus(academy.id, nextStatus));
    setViewing((prev) =>
      prev?.id === academy.id ? { ...prev, status: nextStatus } : prev
    );
  };

  const emptyState = (
    <div className="py-10 sm:py-12 px-4 text-center text-gray-400 font-medium text-sm">
      No academies found matching search/filter criteria.
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate">
              {filterByBrandId !== undefined ? "My Academy" : "Academy List"}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {filterByBrandId !== undefined
                ? "All locations of your academy brand. Click a row to manage members."
                : "View and manage all academies on the platform."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
          {showAddLocationButton && (
            <Link
              to={addLocationPath}
              className="h-10 px-4 text-xs font-semibold rounded-xl border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition inline-flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation"
            >
              <Plus size={16} />
              Add Location
            </Link>
          )}
          {showCreateButton && (
          <Link
            to="/superadmin/academies/create"
            className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition inline-flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto touch-manipulation"
          >
            <Plus size={16} />
            Create Academy
          </Link>
          )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-3 py-4 sm:py-6">
          <div className="relative w-full md:flex-1 md:min-w-[200px] lg:min-w-[240px]">
            <input
              type="text"
              placeholder="Search by academy name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:border-[var(--accent)] transition"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={15}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-auto md:min-w-[180px] h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="">All Types</option>
            {ACADEMY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto md:min-w-[160px] h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none text-[var(--text-primary)] focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition inline-flex items-center justify-center gap-1 touch-manipulation"
            title="Reset Filters"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="lg:hidden">
          {paginatedAcademies.length > 0 ? (
            <ul className="flex flex-col gap-3 sm:gap-4">
              {paginatedAcademies.map((academy) => (
                <li
                  key={academy.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/40 p-3 sm:p-4 cursor-pointer hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition"
                  onClick={() => handleOpenAcademy(academy.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenAcademy(academy.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={academy.logo}
                      alt=""
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] leading-snug break-words hover:text-[var(--accent)] transition">
                          {academy.name}
                        </h3>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${statusStyles[academy.status]}`}
                        >
                          {academy.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} className="shrink-0" />
                          {academy.city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users size={12} className="shrink-0" />
                          {academy.studentCount} students
                        </span>
                      </div>
                      <span className="mt-2 inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                        {academy.type}
                      </span>
                    </div>
                  </div>
                  {canManage && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <TableRowActions
                      onView={() => handleView(academy)}
                      onEdit={() => handleEdit(academy.id)}
                      onToggleStatus={() => handleToggleStatus(academy)}
                      isActive={academy.status === "Active"}
                    />
                  </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            emptyState
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Logo</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Academy Name</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Location</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Type</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">No. of Students</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Status</th>
                  {canManage && (
                    <th className="py-3 px-3 xl:px-4 text-center whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedAcademies.length > 0 ? (
                  paginatedAcademies.map((academy) => (
                    <tr
                      key={academy.id}
                      className="hover:bg-gray-50/50 transition cursor-pointer"
                      onClick={() => handleOpenAcademy(academy.id)}
                    >
                      <td className="py-3.5 px-3 xl:px-4">
                        <img
                          src={academy.logo}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                        />
                      </td>
                      <td className="py-3.5 px-3 xl:px-4 max-w-[200px] xl:max-w-none">
                        <p className="font-semibold text-[var(--text-primary)] truncate hover:text-[var(--accent)] transition">
                          {academy.name}
                        </p>
                      </td>
                      <td className="py-3.5 px-3 xl:px-4 text-gray-600 font-medium whitespace-nowrap">
                        {academy.city}
                      </td>
                      <td className="py-3.5 px-3 xl:px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                          {academy.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 xl:px-4 text-gray-600 font-medium whitespace-nowrap">
                        {academy.studentCount}
                      </td>
                      <td className="py-3.5 px-3 xl:px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[academy.status]}`}
                        >
                          {academy.status}
                        </span>
                      </td>
                      {canManage && (
                      <td className="py-3.5 px-3 xl:px-4" onClick={(e) => e.stopPropagation()}>
                        <TableRowActions
                          onView={() => handleView(academy)}
                          onEdit={() => handleEdit(academy.id)}
                          onToggleStatus={() => handleToggleStatus(academy)}
                          isActive={academy.status === "Active"}
                        />
                      </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canManage ? 7 : 6}>{emptyState}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAcademies.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          label="academies"
        />
      </div>

      {viewing && (
        <AcademyViewModal
          academy={viewing}
          onClose={() => setViewing(null)}
          onEdit={(id) => handleEdit(id)}
        />
      )}

      {editing && (
        <AcademyEditModal
          academy={editing}
          onClose={() => setEditing(null)}
          onSaved={() => refresh()}
        />
      )}
    </div>
  );
}
