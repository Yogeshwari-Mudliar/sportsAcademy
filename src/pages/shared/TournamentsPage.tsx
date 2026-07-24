import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import TableImportExport from "@/components/table/TableImportExport";
import StatusDot from "@/components/table/StatusDot";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";
import { getAcademies, getAcademiesByBrandId } from "@/data/academies";
import {
  TOURNAMENT_CATEGORIES,
  TOURNAMENT_FORMATS,
  TOURNAMENTS_UPDATED_EVENT,
  addTournament,
  canManageTournament,
  getVisibleTournaments,
  setTournamentStatus,
  updateTournament,
  type Tournament,
  type TournamentCategory,
  type TournamentFormat,
  type TournamentStatus,
} from "@/data/tournaments";
import { downloadCsv, parseCsv, readFileAsText, toCsv } from "@/utils/csv";
import { truncateText } from "@/utils/display";

function formatDisplayDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TournamentsPage() {
  const dispatch = useAppDispatch();
  const user = getCurrentUser();
  const isSuperAdmin = user?.role === ROLES.superadmin;
  const canCreate = isSuperAdmin || user?.role === ROLES.admin;

  const [tick, setTick] = useState(0);
  const tournaments = useMemo(() => getVisibleTournaments(user), [user, tick]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewing, setViewing] = useState<Tournament | null>(null);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Tournaments",
        breadcrumb: ["Dashboard", "Tournaments"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener(TOURNAMENTS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(TOURNAMENTS_UPDATED_EVENT, refresh);
  }, []);

  const allAcademies = useMemo(() => getAcademies(), []);
  const selectableAcademies = useMemo(() => {
    if (isSuperAdmin) return allAcademies;
    if (user?.role === ROLES.admin && user.academyId) {
      return getAcademiesByBrandId(user.academyId);
    }
    return [];
  }, [allAcademies, isSuperAdmin, user]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return tournaments.filter((t) => {
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.academyName.toLowerCase().includes(query) ||
        t.city.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || t.status === statusFilter;
      const matchesFormat = !formatFilter || t.format === formatFilter;
      const matchesCategory = !categoryFilter || t.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesFormat && matchesCategory;
    });
  }, [tournaments, debouncedSearch, statusFilter, formatFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, formatFilter, categoryFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setFormatFilter("");
    setCategoryFilter("");
  };

  const handleToggleStatus = (tournament: Tournament) => {
    if (!canManageTournament(user, tournament)) {
      window.alert("Only the host academy admin or Super Admin can change this tournament.");
      return;
    }
    const nextStatus: TournamentStatus =
      tournament.status === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this tournament?`)) return;
    setTournamentStatus(tournament.id, nextStatus);
    setViewing((v) => (v?.id === tournament.id ? { ...v, status: nextStatus } : v));
  };

  const handleExport = () => {
    const headers = [
      "name",
      "academyId",
      "academyName",
      "city",
      "format",
      "category",
      "startDate",
      "endDate",
      "teams",
      "status",
    ];
    downloadCsv(
      "tournaments-export.csv",
      toCsv(
        headers,
        filtered.map((t) => ({
          name: t.name,
          academyId: t.academyId,
          academyName: t.academyName,
          city: t.city,
          format: t.format,
          category: t.category,
          startDate: t.startDate,
          endDate: t.endDate,
          teams: t.teams,
          status: t.status,
        }))
      )
    );
  };

  const handleImport = async (file: File) => {
    if (!canCreate) return;
    const text = await readFileAsText(file);
    const { rows } = parseCsv(text);
    let count = 0;
    for (const row of rows) {
      const name = (row.name || "").trim();
      if (!name) continue;
      const academyId = Number(row.academyid || row.academyId);
      const academy =
        selectableAcademies.find((a) => a.id === academyId) ||
        selectableAcademies.find(
          (a) =>
            a.name.toLowerCase() ===
            (row.academyname || row.academyName || "").toLowerCase()
        );
      if (!academy) continue;
      const formatRaw = (row.format || "T20").trim() as TournamentFormat;
      const format = TOURNAMENT_FORMATS.includes(formatRaw) ? formatRaw : "T20";
      const categoryRaw = (row.category || "Internal").trim();
      const category: TournamentCategory =
        categoryRaw.toLowerCase() === "external" ? "External" : "Internal";
      const statusRaw = (row.status || "Active").trim();
      addTournament({
        name,
        academyId: academy.id,
        academyName: academy.name,
        city: (row.city || academy.city || "").trim(),
        format,
        category,
        startDate: (row.startdate || row.startDate || "").trim() || "2026-08-01",
        endDate: (row.enddate || row.endDate || "").trim() || "2026-08-15",
        teams: Number(row.teams) || 4,
        status: statusRaw.toLowerCase() === "inactive" ? "Inactive" : "Active",
      });
      count += 1;
    }
    setTick((t) => t + 1);
    if (count) window.alert(`Imported ${count} tournaments.`);
    else
      window.alert(
        "No valid tournaments imported. Need name and your own academyId/academyName."
      );
  };

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Tournaments</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Internal = your academy only · External = all academies · {filtered.length} records
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TableImportExport
              show={canCreate}
              onExport={handleExport}
              onImportFile={handleImport}
            />
            <TableAddButton
              label="Add Tournament"
              show={canCreate && selectableAcademies.length > 0}
              onClick={() => setAdding(true)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 py-4 sm:py-6">
          <div className="relative w-full md:flex-1 md:min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, academy or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none focus:border-[var(--accent)]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto md:min-w-[140px] h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none"
          >
            <option value="">All Categories</option>
            {TOURNAMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto md:min-w-[140px] h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="w-full md:w-auto md:min-w-[140px] h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none"
          >
            <option value="">All Formats</option>
            {TOURNAMENT_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 inline-flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-medium text-sm">
            No tournaments found matching search/filter criteria.
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-2 w-[18%]">Tournament</th>
                  <th className="py-3 px-2 w-[14%]">Academy</th>
                  <th className="py-3 px-2 w-[10%]">Category</th>
                  <th className="py-3 px-2 w-[9%]">City</th>
                  <th className="py-3 px-2 w-[9%]">Format</th>
                  <th className="py-3 px-2 w-[11%]">Start</th>
                  <th className="py-3 px-2 w-[11%]">End</th>
                  <th className="py-3 px-2 w-[7%]">Teams</th>
                  <th className="py-3 px-2 w-[8%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginated.map((tournament) => {
                  const canEdit = canManageTournament(user, tournament);
                  return (
                    <tr key={tournament.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-2 overflow-hidden">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold truncate flex-1 min-w-0" title={tournament.name}>
                            {tournament.name}
                          </span>
                          <StatusDot status={tournament.status} className="shrink-0" />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate" title={tournament.academyName}>
                          {truncateText(tournament.academyName, 24)}
                        </span>
                      </td>
                      <td className="py-3 px-2 overflow-hidden">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            tournament.category === "External"
                              ? "bg-sky-50 text-sky-700 border-sky-100"
                              : "bg-violet-50 text-violet-700 border-violet-100"
                          }`}
                        >
                          {tournament.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate">{tournament.city}</span>
                      </td>
                      <td className="py-3 px-2 overflow-hidden">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                          {tournament.format}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate">{formatDisplayDate(tournament.startDate)}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate">{formatDisplayDate(tournament.endDate)}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-600">{tournament.teams}</td>
                      <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <TableRowActions
                          onView={() => setViewing(tournament)}
                          onEdit={canEdit ? () => setEditing(tournament) : undefined}
                          onToggleStatus={canEdit ? () => handleToggleStatus(tournament) : undefined}
                          canEdit={canEdit}
                          isActive={tournament.status === "Active"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          label="records"
        />
      </div>

      {viewing && (
        <TournamentModal
          mode="view"
          tournament={viewing}
          academies={selectableAcademies}
          canEdit={canManageTournament(user, viewing)}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setViewing(null);
            setEditing(viewing);
          }}
        />
      )}
      {(adding || editing) && (
        <TournamentModal
          mode={adding ? "add" : "edit"}
          tournament={editing}
          academies={selectableAcademies}
          canEdit
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSave={(data) => {
            if (editing) {
              if (!canManageTournament(user, editing)) {
                window.alert("You can only edit tournaments of your own academy.");
                return;
              }
              updateTournament(editing.id, data);
              setEditing(null);
            } else {
              addTournament(data);
              setAdding(false);
            }
            setTick((t) => t + 1);
          }}
        />
      )}
    </div>
  );
}

function TournamentModal({
  mode,
  tournament,
  academies,
  canEdit,
  onClose,
  onSave,
  onEdit,
}: {
  mode: "view" | "add" | "edit";
  tournament: Tournament | null;
  academies: ReturnType<typeof getAcademies>;
  canEdit?: boolean;
  onClose: () => void;
  onSave?: (data: Omit<Tournament, "id" | "createdOn">) => void;
  onEdit?: () => void;
}) {
  const [academyId, setAcademyId] = useState(
    tournament?.academyId ?? academies[0]?.id ?? 0
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSave) return;
    const fd = new FormData(e.currentTarget);
    const academy = academies.find((a) => a.id === academyId);
    onSave({
      name: String(fd.get("name") || "").trim(),
      academyId,
      academyName: academy?.name ?? "",
      city: String(fd.get("city") || academy?.city || "").trim(),
      format: String(fd.get("format")) as TournamentFormat,
      category: String(fd.get("category")) as TournamentCategory,
      startDate: String(fd.get("startDate") || ""),
      endDate: String(fd.get("endDate") || ""),
      teams: Number(fd.get("teams")) || 4,
      status: String(fd.get("status")) as TournamentStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {mode === "view" ? "Tournament Details" : mode === "add" ? "Add Tournament" : "Edit Tournament"}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {mode === "view" && tournament ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Detail label="Name" value={tournament.name} />
              <Detail label="Status" value={tournament.status} />
              <Detail label="Category" value={tournament.category} />
              <Detail label="Academy" value={tournament.academyName} />
              <Detail label="City" value={tournament.city} />
              <Detail label="Format" value={tournament.format} />
              <Detail label="Teams" value={String(tournament.teams)} />
              <Detail label="Start" value={formatDisplayDate(tournament.startDate)} />
              <Detail label="End" value={formatDisplayDate(tournament.endDate)} />
            </div>
            {canEdit && onEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onEdit}
                  className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] text-white"
                >
                  Edit Tournament
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              required
              defaultValue={tournament?.name}
              placeholder="Tournament name"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[var(--accent)]"
            />
            <select
              value={academyId}
              onChange={(e) => setAcademyId(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
            >
              {academies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.city}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select
                name="category"
                defaultValue={tournament?.category ?? "Internal"}
                className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
              >
                {TOURNAMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                name="format"
                defaultValue={tournament?.format ?? "T20"}
                className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
              >
                {TOURNAMENT_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-gray-500 -mt-1">
              Internal: only your academy · External: visible to all academies
            </p>
            <input
              name="city"
              defaultValue={tournament?.city ?? academies.find((a) => a.id === academyId)?.city}
              placeholder="City"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="teams"
                type="number"
                min={2}
                defaultValue={tournament?.teams ?? 8}
                placeholder="Teams"
                className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
              <select
                name="status"
                defaultValue={tournament?.status ?? "Active"}
                className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="startDate"
                type="date"
                defaultValue={tournament?.startDate ?? ""}
                className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
              <input
                name="endDate"
                type="date"
                defaultValue={tournament?.endDate ?? ""}
                className="h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 text-xs font-semibold rounded-xl border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] text-white"
              >
                {mode === "add" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase text-gray-400">{label}</p>
      <p className="font-medium text-[var(--text-primary)] mt-0.5">{value}</p>
    </div>
  );
}
