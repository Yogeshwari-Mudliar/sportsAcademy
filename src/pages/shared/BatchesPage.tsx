import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import TableImportExport from "@/components/table/TableImportExport";
import StatusDot from "@/components/table/StatusDot";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAcademies } from "@/data/academies";
import { getMembersByAcademyAndRole } from "@/data/academyMembers";
import {
  BATCHES_UPDATED_EVENT,
  addBatch,
  getBatches,
  setBatchStatus,
  updateBatch,
  type Batch,
  type BatchStatus,
} from "@/data/batches";
import { downloadCsv, parseCsv, readFileAsText, toCsv } from "@/utils/csv";
import { abbreviateDays, truncateText } from "@/utils/display";

function parseTiming(timing?: string): { start: string; end: string } {
  if (!timing) return { start: "06:00", end: "08:00" };
  const parts = timing.split("-").map((p) => p.trim());
  const to24 = (value: string) => {
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) {
      if (/^\d{2}:\d{2}$/.test(value)) return value;
      return "06:00";
    }
    let hour = Number(match[1]);
    const minute = match[2];
    const meridian = (match[3] || "").toUpperCase();
    if (meridian === "PM" && hour < 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${minute}`;
  };
  return {
    start: to24(parts[0] || "06:00"),
    end: to24(parts[1] || "08:00"),
  };
}

function formatTiming(start: string, end: string) {
  const to12 = (value: string) => {
    const [hRaw, m] = value.split(":");
    let h = Number(hRaw);
    const meridian = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m} ${meridian}`;
  };
  return `${to12(start)} - ${to12(end)}`;
}

export default function BatchesPage() {
  const dispatch = useAppDispatch();
  const canManage = useCanManageTables();
  const [batches, setBatches] = useState<Batch[]>(() => getBatches());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [academyFilter, setAcademyFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewing, setViewing] = useState<Batch | null>(null);
  const [editing, setEditing] = useState<Batch | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Batches",
        breadcrumb: ["Dashboard", "Batches"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const refresh = () => setBatches(getBatches());
    window.addEventListener(BATCHES_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(BATCHES_UPDATED_EVENT, refresh);
  }, []);

  const academies = useMemo(() => getAcademies(), []);

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return batches.filter((batch) => {
      const matchesSearch =
        !query ||
        batch.name.toLowerCase().includes(query) ||
        batch.coachName.toLowerCase().includes(query) ||
        batch.academyName.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || batch.status === statusFilter;
      const matchesAcademy =
        !academyFilter || String(batch.academyId) === academyFilter;
      return matchesSearch && matchesStatus && matchesAcademy;
    });
  }, [batches, debouncedSearch, statusFilter, academyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, academyFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setAcademyFilter("");
  };

  const handleToggleStatus = (batch: Batch) => {
    const nextStatus: BatchStatus = batch.status === "Active" ? "Inactive" : "Active";
    const label = nextStatus === "Active" ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${label} this batch?`)) return;
    setBatches(setBatchStatus(batch.id, nextStatus));
    setViewing((v) => (v?.id === batch.id ? { ...v, status: nextStatus } : v));
  };

  const handleExport = () => {
    const headers = [
      "name",
      "academyId",
      "academyName",
      "coachName",
      "timing",
      "days",
      "capacity",
      "status",
    ];
    downloadCsv(
      "batches-export.csv",
      toCsv(
        headers,
        filtered.map((b) => ({
          name: b.name,
          academyId: b.academyId,
          academyName: b.academyName,
          coachName: b.coachName,
          timing: b.timing,
          days: b.days,
          capacity: b.capacity,
          status: b.status,
        }))
      )
    );
  };

  const handleImport = async (file: File) => {
    const text = await readFileAsText(file);
    const { rows } = parseCsv(text);
    let count = 0;
    for (const row of rows) {
      const name = (row.name || "").trim();
      if (!name) continue;
      const academyId = Number(row.academyid || row.academyId);
      const academy =
        academies.find((a) => a.id === academyId) ||
        academies.find(
          (a) => a.name.toLowerCase() === (row.academyname || row.academyName || "").toLowerCase()
        );
      if (!academy) continue;
      const statusRaw = (row.status || "Active").trim();
      const status: BatchStatus =
        statusRaw.toLowerCase() === "inactive" ? "Inactive" : "Active";
      addBatch({
        name,
        academyId: academy.id,
        academyName: academy.name,
        coachName: (row.coachname || row.coachName || "").trim() || "TBD",
        timing: (row.timing || "06:00 AM - 08:00 AM").trim(),
        days: (row.days || "Mon, Wed, Fri").trim(),
        capacity: Number(row.capacity) || 20,
        status,
      });
      count += 1;
    }
    setBatches(getBatches());
    if (count) window.alert(`Imported ${count} batches.`);
    else window.alert("No valid batches imported. Need name and academyId/academyName.");
  };

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Batches</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Manage training batches across academies · {filtered.length} records
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TableImportExport
              show={canManage}
              onExport={handleExport}
              onImportFile={handleImport}
            />
            <TableAddButton label="Add Batch" show={canManage} onClick={() => setAdding(true)} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 py-4 sm:py-6">
          <div className="relative w-full md:flex-1 md:min-w-[200px]">
            <input
              type="text"
              placeholder="Search by batch, coach or academy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none focus:border-[var(--accent)]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
          </div>

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
            value={academyFilter}
            onChange={(e) => setAcademyFilter(e.target.value)}
            className="w-full md:w-auto md:min-w-[200px] h-10 px-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl text-sm outline-none"
          >
            <option value="">All Academies</option>
            {academies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.city}
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
            No batches found matching search/filter criteria.
          </div>
        ) : (
          <>
            <ul className="lg:hidden flex flex-col gap-3">
              {paginated.map((batch) => (
                <li
                  key={batch.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{batch.name}</p>
                        <StatusDot status={batch.status} className="shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {truncateText(batch.academyName, 32)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                        <span>Coach: {batch.coachName}</span>
                        <span>{batch.timing}</span>
                        <span>{abbreviateDays(batch.days)}</span>
                        <span>
                          {batch.enrolled}/{batch.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                      <TableRowActions
                        onView={() => setViewing(batch)}
                        onEdit={() => setEditing(batch)}
                        onToggleStatus={() => handleToggleStatus(batch)}
                        isActive={batch.status === "Active"}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="hidden lg:block w-full overflow-x-auto">
              <table className="w-full min-w-[700px] table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                    <th className="py-3 px-2 w-[18%]">Batch</th>
                    <th className="py-3 px-2 w-[18%]">Academy</th>
                    <th className="py-3 px-2 w-[14%]">Coach</th>
                    <th className="py-3 px-2 w-[16%]">Timing</th>
                    <th className="py-3 px-2 w-[10%]">Days</th>
                    <th className="py-3 px-2 w-[10%]">Capacity</th>
                    {canManage && <th className="py-3 px-2 w-[8%] text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginated.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-2 overflow-hidden">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold truncate min-w-0" title={batch.name}>
                            {batch.name}
                          </span>
                          <StatusDot status={batch.status} className="shrink-0" />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate" title={batch.academyName}>
                          {truncateText(batch.academyName, 24)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate" title={batch.coachName}>
                          {batch.coachName}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 overflow-hidden">
                        <span className="block truncate" title={batch.timing}>
                          {batch.timing}
                        </span>
                      </td>
                      <td
                        className="py-3 px-2 text-gray-600 overflow-hidden tracking-wide"
                        title={batch.days}
                      >
                        <span className="block truncate">{abbreviateDays(batch.days)}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {batch.enrolled}/{batch.capacity}
                      </td>
                      {canManage && (
                        <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <TableRowActions
                            onView={() => setViewing(batch)}
                            onEdit={() => setEditing(batch)}
                            onToggleStatus={() => handleToggleStatus(batch)}
                            isActive={batch.status === "Active"}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
          label="batches"
        />
      </div>

      {(viewing || editing || adding) && (
        <BatchModal
          mode={adding ? "add" : editing ? "edit" : "view"}
          batch={viewing ?? editing ?? undefined}
          academies={academies}
          onClose={() => {
            setViewing(null);
            setEditing(null);
            setAdding(false);
          }}
          onEdit={() => {
            if (viewing) {
              setEditing(viewing);
              setViewing(null);
            }
          }}
          onSave={(data) => {
            if (editing) {
              setBatches(updateBatch(editing.id, data));
              setEditing(null);
            } else {
              const academy = academies.find((a) => a.id === data.academyId);
              setBatches(
                addBatch({
                  name: data.name,
                  academyId: data.academyId,
                  academyName: academy?.name ?? data.academyName,
                  coachName: data.coachName,
                  timing: data.timing,
                  days: data.days,
                  capacity: data.capacity,
                  enrolled: data.enrolled ?? 0,
                  status: data.status,
                })
              );
              setAdding(false);
            }
          }}
        />
      )}
    </div>
  );
}

function BatchModal({
  mode,
  batch,
  academies,
  onClose,
  onEdit,
  onSave,
}: {
  mode: "view" | "edit" | "add";
  batch?: Batch;
  academies: { id: number; name: string; city: string }[];
  onClose: () => void;
  onEdit: () => void;
  onSave: (data: {
    name: string;
    academyId: number;
    academyName: string;
    coachName: string;
    timing: string;
    days: string;
    capacity: number;
    enrolled?: number;
    status: BatchStatus;
  }) => void;
}) {
  const isView = mode === "view";
  const initialTiming = parseTiming(batch?.timing);
  const [academyId, setAcademyId] = useState<number>(
    batch?.academyId ?? academies[0]?.id ?? 0
  );
  const [coachName, setCoachName] = useState(batch?.coachName ?? "");
  const [startTime, setStartTime] = useState(initialTiming.start);
  const [endTime, setEndTime] = useState(initialTiming.end);

  const coaches = useMemo(
    () =>
      getMembersByAcademyAndRole(academyId, "coach").filter(
        (c) => c.status === "Active"
      ),
    [academyId]
  );

  useEffect(() => {
    if (!coaches.length) {
      setCoachName("");
      return;
    }
    if (!coaches.some((c) => c.name === coachName)) {
      setCoachName(coaches[0].name);
    }
  }, [coaches, coachName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const academy = academies.find((a) => a.id === academyId);
    if (!coachName) {
      window.alert("Please select a coach for this academy.");
      return;
    }
    onSave({
      name: String(fd.get("name")),
      academyId,
      academyName: academy?.name ?? "",
      coachName,
      timing: formatTiming(startTime, endTime),
      days: String(fd.get("days")),
      capacity: Number(fd.get("capacity")) || 20,
      enrolled: batch?.enrolled ?? 0,
      status: String(fd.get("status")) as BatchStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {mode === "add" ? "Add Batch" : mode === "edit" ? "Edit Batch" : "View Batch"}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {isView && batch ? (
          <div className="space-y-3 text-sm">
            <Detail label="Batch" value={batch.name} />
            <Detail label="Academy" value={batch.academyName} />
            <Detail label="Coach" value={batch.coachName} />
            <Detail label="Timing" value={batch.timing} />
            <Detail label="Days" value={batch.days} />
            <Detail label="Capacity" value={`${batch.enrolled}/${batch.capacity}`} />
            <Detail label="Status" value={batch.status} />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold"
                onClick={onEdit}
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              defaultValue={batch?.name}
              placeholder="Batch name"
              required
              className="w-full h-10 px-3 border rounded-xl text-sm"
            />
            <select
              value={academyId}
              onChange={(e) => setAcademyId(Number(e.target.value))}
              className="w-full h-10 px-3 border rounded-xl text-sm"
              required
            >
              {academies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.city}
                </option>
              ))}
            </select>
            <select
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              className="w-full h-10 px-3 border rounded-xl text-sm"
              required
            >
              {coaches.length === 0 ? (
                <option value="">No coaches for this academy</option>
              ) : (
                coaches.map((coach) => (
                  <option key={coach.id} value={coach.name}>
                    {coach.name}
                  </option>
                ))
              )}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold uppercase text-gray-400">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="mt-1 w-full h-10 px-3 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-gray-400">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="mt-1 w-full h-10 px-3 border rounded-xl text-sm"
                />
              </div>
            </div>
            <input
              name="days"
              defaultValue={batch?.days}
              placeholder="Days (e.g. Mon, Wed, Fri)"
              required
              className="w-full h-10 px-3 border rounded-xl text-sm"
            />
            <input
              name="capacity"
              type="number"
              min={1}
              defaultValue={batch?.capacity ?? 20}
              placeholder="Capacity"
              required
              className="w-full h-10 px-3 border rounded-xl text-sm"
            />
            <select
              name="status"
              defaultValue={batch?.status ?? "Active"}
              className="w-full h-10 px-3 border rounded-xl text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold"
              >
                Save
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
      <p className="text-[11px] font-semibold uppercase text-gray-400">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
