import type { AccountUser } from "@/data/account";
import { getLocationIdsByBrandId } from "@/data/academies";
import { ROLES } from "@/constants/roles";

export type TournamentStatus = "Active" | "Inactive";
export type TournamentFormat = "T20" | "ODI" | "Test" | "League" | "Knockout";
/** Internal = only host academy sees it; External = all academies see it */
export type TournamentCategory = "Internal" | "External";

export interface Tournament {
  id: number;
  name: string;
  academyId: number;
  academyName: string;
  city: string;
  format: TournamentFormat;
  category: TournamentCategory;
  startDate: string;
  endDate: string;
  teams: number;
  status: TournamentStatus;
  createdOn: string;
}

const STORAGE_KEY = "academy_tournaments_v2";
export const TOURNAMENTS_UPDATED_EVENT = "tournamentsUpdated";

export const TOURNAMENT_FORMATS: TournamentFormat[] = [
  "T20",
  "ODI",
  "Test",
  "League",
  "Knockout",
];

export const TOURNAMENT_CATEGORIES: TournamentCategory[] = ["Internal", "External"];

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: "Summer Cup 2026",
    academyId: 1,
    academyName: "Mumbai Cricket Club",
    city: "Mumbai",
    format: "T20",
    category: "Internal",
    startDate: "2026-08-01",
    endDate: "2026-08-15",
    teams: 8,
    status: "Active",
    createdOn: "10 Jun, 2026",
  },
  {
    id: 2,
    name: "Monsoon Challenge",
    academyId: 2,
    academyName: "Delhi Cricket Academy",
    city: "New Delhi",
    format: "League",
    category: "External",
    startDate: "2026-07-20",
    endDate: "2026-08-05",
    teams: 6,
    status: "Active",
    createdOn: "12 Jun, 2026",
  },
  {
    id: 3,
    name: "Youth Knockout",
    academyId: 3,
    academyName: "Bangalore Sports Hub",
    city: "Bangalore",
    format: "Knockout",
    category: "Internal",
    startDate: "2026-09-01",
    endDate: "2026-09-10",
    teams: 12,
    status: "Inactive",
    createdOn: "15 Jun, 2026",
  },
  {
    id: 4,
    name: "All-India Open Trophy",
    academyId: 1,
    academyName: "Mumbai Cricket Club",
    city: "Mumbai",
    format: "ODI",
    category: "External",
    startDate: "2026-10-01",
    endDate: "2026-10-20",
    teams: 16,
    status: "Active",
    createdOn: "18 Jun, 2026",
  },
];

function writeTournaments(list: Tournament[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(TOURNAMENTS_UPDATED_EVENT));
}

function normalizeTournament(raw: Partial<Tournament> & { id: number }): Tournament {
  return {
    id: raw.id,
    name: raw.name || "Untitled",
    academyId: Number(raw.academyId) || 0,
    academyName: raw.academyName || "",
    city: raw.city || "",
    format: TOURNAMENT_FORMATS.includes(raw.format as TournamentFormat)
      ? (raw.format as TournamentFormat)
      : "T20",
    category: raw.category === "External" ? "External" : "Internal",
    startDate: raw.startDate || "",
    endDate: raw.endDate || "",
    teams: Number(raw.teams) || 0,
    status: raw.status === "Inactive" ? "Inactive" : "Active",
    createdOn: raw.createdOn || "",
  };
}

export function getTournaments(): Tournament[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<Tournament>[];
      if (Array.isArray(stored) && stored.length > 0) {
        return stored
          .filter((t): t is Partial<Tournament> & { id: number } => typeof t?.id === "number")
          .map(normalizeTournament);
      }
    }
  } catch {
    /* fall through */
  }
  writeTournaments(INITIAL_TOURNAMENTS);
  return INITIAL_TOURNAMENTS;
}

/** Academy location IDs owned by current admin (brand). Empty for non-admin. */
export function getOwnedAcademyIds(user: AccountUser | null): number[] {
  if (!user) return [];
  if (user.role === ROLES.superadmin) {
    return []; // empty means "all" for superadmin — use canManage helpers instead
  }
  if (user.role === ROLES.admin && user.academyId) {
    return getLocationIdsByBrandId(user.academyId);
  }
  return [];
}

export function canManageTournament(
  user: AccountUser | null,
  tournament: Tournament
): boolean {
  if (!user) return false;
  if (user.role === ROLES.superadmin) return true;
  if (user.role === ROLES.admin && user.academyId) {
    return getLocationIdsByBrandId(user.academyId).includes(tournament.academyId);
  }
  return false;
}

export function canViewTournament(
  user: AccountUser | null,
  tournament: Tournament
): boolean {
  if (!user) return false;
  if (user.role === ROLES.superadmin) return true;
  if (tournament.category === "External") return true;
  // Internal: only host academy's admin (and brand locations)
  if (user.role === ROLES.admin && user.academyId) {
    return getLocationIdsByBrandId(user.academyId).includes(tournament.academyId);
  }
  return false;
}

export function getVisibleTournaments(user: AccountUser | null): Tournament[] {
  return getTournaments().filter((t) => canViewTournament(user, t));
}

export function addTournament(
  data: Omit<Tournament, "id" | "createdOn">
): Tournament[] {
  const list = getTournaments();
  const nextId = list.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const tournament: Tournament = {
    ...data,
    category: data.category === "External" ? "External" : "Internal",
    id: nextId,
    createdOn: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  writeTournaments([tournament, ...list]);
  return getTournaments();
}

export function updateTournament(
  id: number,
  data: Partial<Omit<Tournament, "id" | "createdOn">>
): Tournament[] {
  const list = getTournaments();
  const index = list.findIndex((t) => t.id === id);
  if (index === -1) return list;
  const next = [...list];
  next[index] = normalizeTournament({ ...list[index], ...data, id });
  writeTournaments(next);
  return next;
}

export function setTournamentStatus(
  id: number,
  status: TournamentStatus
): Tournament[] {
  return updateTournament(id, { status });
}
