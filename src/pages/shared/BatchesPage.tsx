import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import TableRowActions from "@/components/table/TableRowActions";
import TableAddButton from "@/components/table/TableAddButton";
import TablePagination from "@/components/table/TablePagination";
import { useCanManageTables } from "@/hooks/useCanManageTables";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAcademies } from "@/data/academies";
import {
  BATCHES_UPDATED_EVENT,
  addBatch,
  getBatches,
  setBatchStatus,
  updateBatch,
  type Batch,
  type BatchStatus,
} from "@/data/batches";

const statusStyles: Record<BatchStatus, string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
};

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

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Batches</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Manage training batches across academies · {filtered.length} records
            </p>
          </div>
          <TableAddButton label="Add Batch" show={canManage} onClick={() => setAdding(true)} />
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
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Academy</th>
                  <th className="py-3 px-3">Coach</th>
                  <th className="py-3 px-3">Timing</th>
                  <th className="py-3 px-3">Days</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3">Status</th>
                  {canManage && <th className="py-3 px-3 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginated.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 font-semibold">{batch.name}</td>
                    <td className="py-3 px-3 text-gray-600">{batch.academyName}</td>
                    <td className="py-3 px-3 text-gray-600">{batch.coachName}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{batch.timing}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{batch.days}</td>
                    <td className="py-3 px-3 text-gray-600">
                      {batch.enrolled}/{batch.capacity}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[batch.status]}`}>
                        {batch.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const academyId = Number(fd.get("academyId"));
    const academy = academies.find((a) => a.id === academyId);
    onSave({
      name: String(fd.get("name")),
      academyId,
      academyName: academy?.name ?? "",
      coachName: String(fd.get("coachName")),
      timing: String(fd.get("timing")),
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
              name="academyId"
              defaultValue={batch?.academyId ?? academies[0]?.id}
              className="w-full h-10 px-3 border rounded-xl text-sm"
              required
            >
              {academies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.city}
                </option>
              ))}
            </select>
            <input
              name="coachName"
              defaultValue={batch?.coachName}
              placeholder="Coach name"
              required
              className="w-full h-10 px-3 border rounded-xl text-sm"
            />
            <input
              name="timing"
              defaultValue={batch?.timing}
              placeholder="Timing (e.g. 06:00 AM - 08:00 AM)"
              required
              className="w-full h-10 px-3 border rounded-xl text-sm"
            />
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
