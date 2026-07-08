import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Edit3,
  Eye,
  Ban,
  CheckCircle2,
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

const statusStyles: Record<AcademyStatus, string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
  Pending: "bg-orange-50 text-orange-600 border border-orange-100",
};

const actionBtnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation";

interface ActionButtonsProps {
  academy: AcademyListItem;
  onEdit: (id: number) => void;
  onView: (academy: AcademyListItem) => void;
  onDeactivate: (id: number) => void;
  onApprove: (id: number) => void;
  showLabels?: boolean;
}

function ActionButtons({
  academy,
  onEdit,
  onView,
  onDeactivate,
  onApprove,
  showLabels = false,
}: ActionButtonsProps) {
  const sizeClass = showLabels
    ? "h-9 px-2.5 text-[11px] font-semibold flex-1 min-w-0"
    : "p-1.5 sm:p-2";

  return (
    <div
      className={
        showLabels
          ? "grid grid-cols-2 gap-2 w-full"
          : "flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
      }
    >
      <button
        type="button"
        onClick={() => onEdit(academy.id)}
        className={`${actionBtnBase} ${sizeClass} border-blue-100 text-blue-600 hover:bg-blue-50`}
        title="Edit"
        aria-label="Edit academy"
      >
        <Edit3 size={14} className="shrink-0" />
        {showLabels && <span className="truncate">Edit</span>}
      </button>
      <button
        type="button"
        onClick={() => onView(academy)}
        className={`${actionBtnBase} ${sizeClass} border-gray-200 text-gray-600 hover:bg-gray-50`}
        title="View"
        aria-label="View academy"
      >
        <Eye size={14} className="shrink-0" />
        {showLabels && <span className="truncate">View</span>}
      </button>
      <button
        type="button"
        onClick={() => onDeactivate(academy.id)}
        disabled={academy.status === "Inactive"}
        className={`${actionBtnBase} ${sizeClass} border-red-100 text-red-500 hover:bg-red-50`}
        title="Deactivate"
        aria-label="Deactivate academy"
      >
        <Ban size={14} className="shrink-0" />
        {showLabels && <span className="truncate">Deactivate</span>}
      </button>
      <button
        type="button"
        onClick={() => onApprove(academy.id)}
        disabled={academy.status !== "Pending"}
        className={`${actionBtnBase} ${sizeClass} border-green-100 text-green-600 hover:bg-green-50`}
        title="Pending Approve"
        aria-label="Approve academy"
      >
        <CheckCircle2 size={14} className="shrink-0" />
        {showLabels && <span className="truncate">Approve</span>}
      </button>
    </div>
  );
}

export default function AcademyList() {
  const navigate = useNavigate();
  const [academies, setAcademies] = useState<AcademyListItem[]>(() => getAcademies());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeType, setActiveType] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [viewing, setViewing] = useState<AcademyListItem | null>(null);

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

  const handleFilter = () => {
    setActiveSearch(search);
    setActiveType(typeFilter);
    setActiveStatus(statusFilter);
  };

  const handleReset = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setActiveSearch("");
    setActiveType("");
    setActiveStatus("");
  };

  const filteredAcademies = academies.filter((academy) => {
    const query = activeSearch.toLowerCase().trim();
    const matchesSearch =
      !query || academy.name.toLowerCase().includes(query);
    const matchesType = !activeType || academy.type === activeType;
    const matchesStatus = !activeStatus || academy.status === activeStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (id: number) => {
    setViewing(null);
    navigate(`/superadmin/academies/${id}/edit`);
  };

  const handleView = (academy: AcademyListItem) => {
    setViewing(academy);
  };

  const handleDeactivate = (id: number) => {
    if (!window.confirm("Are you sure you want to deactivate this academy?")) return;
    setAcademies(updateAcademyStatus(id, "Inactive"));
    setViewing((prev) =>
      prev?.id === id ? { ...prev, status: "Inactive" } : prev
    );
  };

  const handleApprove = (id: number) => {
    if (!window.confirm("Approve this academy?")) return;
    setAcademies(updateAcademyStatus(id, "Active"));
    setViewing((prev) =>
      prev?.id === id ? { ...prev, status: "Active" } : prev
    );
  };

  const emptyState = (
    <div className="py-10 sm:py-12 px-4 text-center text-gray-400 font-medium text-sm">
      No academies found matching search/filter criteria.
    </div>
  );

  const actionProps = {
    onEdit: handleEdit,
    onView: handleView,
    onDeactivate: handleDeactivate,
    onApprove: handleApprove,
  };

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate">
              Academy List
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              View and manage all academies on the platform.
            </p>
          </div>
          <Link
            to="/superadmin/academies/create"
            className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition inline-flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto shrink-0 touch-manipulation"
          >
            <Plus size={16} />
            Create Academy
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-3 py-4 sm:py-6">
          <div className="relative w-full md:flex-1 md:min-w-[200px] lg:min-w-[240px]">
            <input
              type="text"
              placeholder="Search by academy name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
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
            <option value="Pending">Pending</option>
          </select>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleFilter}
              className="h-10 flex-1 md:flex-none px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition inline-flex items-center justify-center gap-1.5 shadow-sm touch-manipulation"
            >
              <Search size={14} />
              SEARCH
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-10 flex-1 md:flex-none px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition inline-flex items-center justify-center gap-1 touch-manipulation"
              title="Reset Filters"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="lg:hidden">
          {filteredAcademies.length > 0 ? (
            <ul className="flex flex-col gap-3 sm:gap-4">
              {filteredAcademies.map((academy) => (
                <li
                  key={academy.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/40 p-3 sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={academy.logo}
                      alt=""
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] leading-snug break-words">
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
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <ActionButtons academy={academy} showLabels {...actionProps} />
                  </div>
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
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">City</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Type</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">No. of Students</th>
                  <th className="py-3 px-3 xl:px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-3 xl:px-4 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAcademies.length > 0 ? (
                  filteredAcademies.map((academy) => (
                    <tr key={academy.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-3 xl:px-4">
                        <img
                          src={academy.logo}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                        />
                      </td>
                      <td className="py-3.5 px-3 xl:px-4 max-w-[200px] xl:max-w-none">
                        <p className="font-semibold text-[var(--text-primary)] truncate">
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
                      <td className="py-3.5 px-3 xl:px-4">
                        <ActionButtons academy={academy} {...actionProps} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>{emptyState}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-between gap-2 pt-4 sm:pt-6 border-t border-gray-100 mt-4">
          <span className="text-xs text-gray-400 font-medium text-center sm:text-left">
            Showing {filteredAcademies.length} of {academies.length} academies
          </span>
        </div>
      </div>

      {viewing && (
        <AcademyViewModal
          academy={viewing}
          onClose={() => setViewing(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
