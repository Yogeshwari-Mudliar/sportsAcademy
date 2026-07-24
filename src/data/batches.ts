export type BatchStatus = "Active" | "Inactive";

export interface Batch {
  id: number;
  name: string;
  academyId: number;
  academyName: string;
  coachName: string;
  timing: string;
  days: string;
  capacity: number;
  enrolled: number;
  status: BatchStatus;
  createdOn: string;
}

const STORAGE_KEY = "academy_batches";
export const BATCHES_UPDATED_EVENT = "batchesUpdated";

const INITIAL_BATCHES: Batch[] = [
  {
    id: 1,
    name: "Morning Beginners",
    academyId: 1,
    academyName: "Mumbai Cricket Club",
    coachName: "Vikram Desai",
    timing: "06:00 AM - 08:00 AM",
    days: "Mon, Wed, Fri",
    capacity: 25,
    enrolled: 18,
    status: "Active",
    createdOn: "15 Jun, 2026",
  },
  {
    id: 2,
    name: "Evening Advanced",
    academyId: 1,
    academyName: "Mumbai Cricket Club",
    coachName: "Anita Rao",
    timing: "05:00 PM - 07:00 PM",
    days: "Tue, Thu, Sat",
    capacity: 20,
    enrolled: 20,
    status: "Active",
    createdOn: "18 Jun, 2026",
  },
  {
    id: 3,
    name: "Kids Cricket Club",
    academyId: 2,
    academyName: "Delhi Cricket Academy",
    coachName: "Suresh Patel",
    timing: "04:00 PM - 05:30 PM",
    days: "Mon - Fri",
    capacity: 30,
    enrolled: 22,
    status: "Active",
    createdOn: "20 Jun, 2026",
  },
  {
    id: 4,
    name: "Weekend Warriors",
    academyId: 3,
    academyName: "Bangalore Sports Hub",
    coachName: "Rajesh Nair",
    timing: "07:00 AM - 10:00 AM",
    days: "Sat, Sun",
    capacity: 15,
    enrolled: 8,
    status: "Inactive",
    createdOn: "10 Jun, 2026",
  },
  {
    id: 5,
    name: "Spin & Pace Lab",
    academyId: 5,
    academyName: "Chennai Super Kings Academy",
    coachName: "Ganesh Kumar",
    timing: "06:30 AM - 08:30 AM",
    days: "Tue, Thu",
    capacity: 12,
    enrolled: 10,
    status: "Active",
    createdOn: "22 Jun, 2026",
  },
  {
    id: 6,
    name: "Women's Batch",
    academyId: 7,
    academyName: "Shubham Cricket Academy",
    coachName: "Rohit Malhotra",
    timing: "05:30 PM - 07:00 PM",
    days: "Mon, Wed, Fri",
    capacity: 18,
    enrolled: 14,
    status: "Active",
    createdOn: "25 Jun, 2026",
  },
];

function writeBatches(batches: Batch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
  window.dispatchEvent(new Event(BATCHES_UPDATED_EVENT));
}

export function getBatches(): Batch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Batch[];
      if (Array.isArray(stored) && stored.length > 0) return stored;
    }
  } catch {
    /* fall through */
  }
  writeBatches(INITIAL_BATCHES);
  return INITIAL_BATCHES;
}

export function addBatch(
  data: Omit<Batch, "id" | "createdOn" | "enrolled"> & { enrolled?: number }
): Batch[] {
  const batches = getBatches();
  const nextId = batches.reduce((max, b) => Math.max(max, b.id), 0) + 1;
  const batch: Batch = {
    ...data,
    id: nextId,
    enrolled: data.enrolled ?? 0,
    createdOn: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  writeBatches([batch, ...batches]);
  return getBatches();
}

export function updateBatch(
  id: number,
  data: Partial<Omit<Batch, "id" | "createdOn">>
): Batch[] {
  const batches = getBatches();
  const index = batches.findIndex((b) => b.id === id);
  if (index === -1) return batches;
  const next = [...batches];
  next[index] = { ...batches[index], ...data };
  writeBatches(next);
  return next;
}

export function setBatchStatus(id: number, status: BatchStatus): Batch[] {
  return updateBatch(id, { status });
}

export function getBatchesByAcademy(academyId: number, onlyActive = true): Batch[] {
  return getBatches().filter(
    (b) => b.academyId === academyId && (!onlyActive || b.status === "Active")
  );
}

export function syncBatchEnrolledCounts(
  getStudentBatchIds: () => Array<number | null | undefined>
): Batch[] {
  const counts = new Map<number, number>();
  for (const batchId of getStudentBatchIds()) {
    if (!batchId) continue;
    counts.set(batchId, (counts.get(batchId) ?? 0) + 1);
  }
  const batches = getBatches().map((batch) => ({
    ...batch,
    enrolled: counts.get(batch.id) ?? 0,
  }));
  writeBatches(batches);
  return batches;
}
