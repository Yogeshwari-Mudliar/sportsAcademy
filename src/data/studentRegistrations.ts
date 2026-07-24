import { addAcademyMember } from "./academyMembers";

export type RegistrationStatus = "Pending" | "Approved" | "Rejected";

export interface StudentRegistration {
  id: number;
  academyId: number;
  academyName: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  parentName: string;
  parentPhone: string;
  playingRole: string;
  /** Renamed from cricket experience — sport-agnostic */
  sportExperience: string;
  address: string;
  city: string;
  status: RegistrationStatus;
  submittedAt: string;
  memberId?: number;
}

const STORAGE_KEY = "student_registrations_v2";
export const REGISTRATIONS_UPDATED_EVENT = "studentRegistrationsUpdated";

function normalizeRegistration(
  raw: Partial<StudentRegistration> & { id: number; experience?: string }
): StudentRegistration {
  return {
    id: raw.id,
    academyId: Number(raw.academyId) || 0,
    academyName: raw.academyName || "",
    name: raw.name || "",
    email: raw.email || "",
    phone: raw.phone || "",
    dateOfBirth: raw.dateOfBirth || "",
    gender: (raw.gender as StudentRegistration["gender"]) || "Male",
    bloodGroup: raw.bloodGroup || "Unknown",
    parentName: raw.parentName || "",
    parentPhone: raw.parentPhone || "",
    playingRole: raw.playingRole || "",
    sportExperience: raw.sportExperience || raw.experience || "",
    address: raw.address || "",
    city: raw.city || "",
    status: (raw.status as RegistrationStatus) || "Approved",
    submittedAt: raw.submittedAt || "",
    memberId: raw.memberId,
  };
}

function readAll(): StudentRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw) as Array<Partial<StudentRegistration> & { id: number; experience?: string }>;
      return list.map(normalizeRegistration);
    }
  } catch {
    /* ignore */
  }
  return [];
}

function writeAll(list: StudentRegistration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(REGISTRATIONS_UPDATED_EVENT));
}

export function getRegistrations(): StudentRegistration[] {
  return readAll();
}

export function getRegistrationsByAcademy(academyId: number): StudentRegistration[] {
  return readAll().filter((r) => r.academyId === academyId);
}

export function addStudentRegistration(
  data: Omit<StudentRegistration, "id" | "status" | "submittedAt" | "memberId">
): StudentRegistration {
  const list = readAll();
  const nextId = list.reduce((max, r) => Math.max(max, r.id), 0) + 1;

  const members = addAcademyMember({
    academyId: data.academyId,
    role: "student",
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: "Active",
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
  const createdMember = members[0];

  const registration: StudentRegistration = {
    ...data,
    id: nextId,
    status: "Approved",
    memberId: createdMember?.id,
    submittedAt: new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  writeAll([registration, ...list]);
  return registration;
}
