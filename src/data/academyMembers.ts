export type AcademyMemberRole = "student" | "coach" | "admin" | "accessory";

export type MemberStatus = "Active" | "Inactive";

export interface AcademyMember {
  id: number;
  academyId: number;
  name: string;
  email: string;
  phone: string;
  role: AcademyMemberRole;
  status: MemberStatus;
  joinedOn: string;
  avatar: string;
  batchId?: number | null;
  batchName?: string;
  /** Student profile fields (optional for non-students) */
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other" | string;
  bloodGroup?: string;
  parentName?: string;
  parentPhone?: string;
  playingRole?: string;
  sportExperience?: string;
  address?: string;
  city?: string;
}

const INITIAL_MEMBERS: AcademyMember[] = [
  // Mumbai Cricket Club (id: 1)
  { id: 101, academyId: 1, name: "Rahul Sharma", email: "rahul.sharma@gmail.com", phone: "+91 98765 43210", role: "admin", status: "Active", joinedOn: "30 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=33" },
  { id: 102, academyId: 1, name: "Vikram Desai", email: "vikram.desai@gmail.com", phone: "+91 98111 22334", role: "coach", status: "Active", joinedOn: "28 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: 103, academyId: 1, name: "Anita Rao", email: "anita.rao@gmail.com", phone: "+91 98222 33445", role: "coach", status: "Active", joinedOn: "25 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=45" },
  { id: 104, academyId: 1, name: "Neha Jain", email: "neha.jain@gmail.com", phone: "+91 98333 44556", role: "student", status: "Active", joinedOn: "20 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=47" },
  { id: 105, academyId: 1, name: "Karan Singh", email: "karan.singh@gmail.com", phone: "+91 98444 55667", role: "student", status: "Active", joinedOn: "18 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=51" },
  { id: 106, academyId: 1, name: "Ravi Kumar", email: "ravi.kumar@gmail.com", phone: "+91 98555 66778", role: "accessory", status: "Active", joinedOn: "15 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=60" },

  // Delhi Cricket Academy (id: 2)
  { id: 201, academyId: 2, name: "Arjun Mehta", email: "arjun.mehta@gmail.com", phone: "+91 91234 56789", role: "admin", status: "Active", joinedOn: "29 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=11" },
  { id: 202, academyId: 2, name: "Suresh Patel", email: "suresh.patel@gmail.com", phone: "+91 91235 56780", role: "coach", status: "Active", joinedOn: "27 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=13" },
  { id: 203, academyId: 2, name: "Meera Shah", email: "meera.shah@gmail.com", phone: "+91 91236 56781", role: "student", status: "Active", joinedOn: "22 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=48" },
  { id: 204, academyId: 2, name: "Deepak Joshi", email: "deepak.joshi@gmail.com", phone: "+91 91237 56782", role: "accessory", status: "Active", joinedOn: "19 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=61" },

  // Bangalore Sports Hub (id: 3)
  { id: 301, academyId: 3, name: "Sneha Iyer", email: "sneha.iyer@gmail.com", phone: "+91 99876 54321", role: "admin", status: "Inactive", joinedOn: "28 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=47" },
  { id: 302, academyId: 3, name: "Rajesh Nair", email: "rajesh.nair@gmail.com", phone: "+91 99877 54322", role: "coach", status: "Active", joinedOn: "26 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=14" },
  { id: 303, academyId: 3, name: "Pooja Reddy", email: "pooja.reddy@gmail.com", phone: "+91 99878 54323", role: "student", status: "Active", joinedOn: "21 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=49" },
  { id: 304, academyId: 3, name: "Manoj Das", email: "manoj.das@gmail.com", phone: "+91 99879 54324", role: "accessory", status: "Inactive", joinedOn: "17 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=62" },

  // Pune Cricket Training (id: 4)
  { id: 401, academyId: 4, name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 98712 34567", role: "coach", status: "Inactive", joinedOn: "27 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: 402, academyId: 4, name: "Sanjay Kulkarni", email: "sanjay.kulkarni@gmail.com", phone: "+91 98713 34568", role: "admin", status: "Active", joinedOn: "24 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=15" },
  { id: 403, academyId: 4, name: "Amit Deshmukh", email: "amit.deshmukh@gmail.com", phone: "+91 98714 34569", role: "student", status: "Active", joinedOn: "16 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=52" },
  { id: 404, academyId: 4, name: "Prakash More", email: "prakash.more@gmail.com", phone: "+91 98715 34570", role: "accessory", status: "Inactive", joinedOn: "14 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=63" },

  // Chennai Super Kings Academy (id: 5)
  { id: 501, academyId: 5, name: "Priya Patel", email: "priya.patel@gmail.com", phone: "+91 91234 87654", role: "admin", status: "Active", joinedOn: "26 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=49" },
  { id: 502, academyId: 5, name: "Ganesh Kumar", email: "ganesh.kumar@gmail.com", phone: "+91 91235 87655", role: "coach", status: "Active", joinedOn: "23 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=16" },
  { id: 503, academyId: 5, name: "Lakshmi Devi", email: "lakshmi.devi@gmail.com", phone: "+91 91236 87656", role: "student", status: "Inactive", joinedOn: "20 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=50" },
  { id: 504, academyId: 5, name: "Senthil Murugan", email: "senthil.m@gmail.com", phone: "+91 91237 87657", role: "accessory", status: "Active", joinedOn: "13 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=64" },

  // Kolkata Cricket Academy (id: 6)
  { id: 601, academyId: 6, name: "Karan Verma", email: "karan.verma@gmail.com", phone: "+91 90000 11122", role: "admin", status: "Active", joinedOn: "25 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=59" },
  { id: 602, academyId: 6, name: "Subhash Banerjee", email: "subhash.b@gmail.com", phone: "+91 90001 11123", role: "coach", status: "Active", joinedOn: "22 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=17" },
  { id: 603, academyId: 6, name: "Ananya Das", email: "ananya.das@gmail.com", phone: "+91 90002 11124", role: "student", status: "Active", joinedOn: "19 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=53" },
  { id: 604, academyId: 6, name: "Biswajit Roy", email: "biswajit.roy@gmail.com", phone: "+91 90003 11125", role: "accessory", status: "Inactive", joinedOn: "12 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=65" },

  // Shubham Cricket Academy — Indore (id: 7)
  { id: 701, academyId: 7, name: "Admin User", email: "admin@sportsacademy.com", phone: "+91 98765 43211", role: "admin", status: "Active", joinedOn: "30 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=33" },
  { id: 702, academyId: 7, name: "Rohit Malhotra", email: "rohit.malhotra@gmail.com", phone: "+91 98100 11223", role: "coach", status: "Active", joinedOn: "28 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=18" },
  { id: 703, academyId: 7, name: "Shubham Tiwari", email: "shubham.tiwari@gmail.com", phone: "+91 98200 22334", role: "student", status: "Active", joinedOn: "24 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=54" },
  { id: 704, academyId: 7, name: "Nitin Sharma", email: "nitin.sharma@gmail.com", phone: "+91 98300 33445", role: "accessory", status: "Active", joinedOn: "20 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=66" },

  // Shubham Cricket Academy — Bhopal (id: 8)
  { id: 801, academyId: 8, name: "Suresh Yadav", email: "suresh.yadav@gmail.com", phone: "+91 98400 44556", role: "coach", status: "Active", joinedOn: "26 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=19" },
  { id: 802, academyId: 8, name: "Aman Patel", email: "aman.patel@gmail.com", phone: "+91 98500 55667", role: "student", status: "Active", joinedOn: "22 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=55" },
  { id: 803, academyId: 8, name: "Vivek Joshi", email: "vivek.joshi@gmail.com", phone: "+91 98600 66778", role: "student", status: "Inactive", joinedOn: "18 Jun, 2026", avatar: "https://i.pravatar.cc/100?img=56" },
];

const STORAGE_KEY = "academy_members";
export const MEMBERS_UPDATED_EVENT = "membersUpdated";

function writeMembers(members: AcademyMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  window.dispatchEvent(new Event(MEMBERS_UPDATED_EVENT));
}

function normalizeMembers(list: AcademyMember[]): AcademyMember[] {
  return list.map((member) => {
    const seed = INITIAL_MEMBERS.find((m) => m.id === member.id);
    const rawStatus = (member.status as string) || seed?.status || "Active";
    const status: MemberStatus =
      rawStatus === "Active" ? "Active" : "Inactive";
    if (!seed) return { ...member, status };
    return {
      ...seed,
      ...member,
      status,
      role: member.role ?? seed.role,
      academyId: member.academyId ?? seed.academyId,
      avatar: member.avatar ?? seed.avatar,
      joinedOn: member.joinedOn ?? seed.joinedOn,
    };
  });
}

function mergeWithSeed(stored: AcademyMember[]): AcademyMember[] {
  const normalized = normalizeMembers(stored);
  const merged = [...normalized];

  for (const seed of INITIAL_MEMBERS) {
    if (!merged.some((m) => m.id === seed.id)) {
      merged.push(seed);
    }
  }

  return merged;
}

function readStorage(): AcademyMember[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AcademyMember[];
  } catch {
    return null;
  }
}

export function getAcademyMembers(): AcademyMember[] {
  const stored = readStorage();
  if (stored && stored.length > 0) {
    const merged = mergeWithSeed(stored);
    if (JSON.stringify(merged) !== JSON.stringify(stored)) {
      writeMembers(merged);
    }
    return merged;
  }
  writeMembers(INITIAL_MEMBERS);
  return INITIAL_MEMBERS;
}

export function addAcademyMember(
  data: Omit<AcademyMember, "id" | "avatar" | "joinedOn"> & { joinedOn?: string }
): AcademyMember[] {
  const members = getAcademyMembers();
  const nextId = members.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  const member: AcademyMember = {
    ...data,
    id: nextId,
    joinedOn: data.joinedOn ?? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    avatar: `https://i.pravatar.cc/100?img=${(nextId % 70) + 1}`,
  };
  writeMembers([member, ...members]);
  return getAcademyMembers();
}

export function updateAcademyMember(
  id: number,
  data: Partial<
    Pick<
      AcademyMember,
      | "name"
      | "email"
      | "phone"
      | "status"
      | "academyId"
      | "batchId"
      | "batchName"
      | "dateOfBirth"
      | "gender"
      | "bloodGroup"
      | "parentName"
      | "parentPhone"
      | "playingRole"
      | "sportExperience"
      | "address"
      | "city"
    >
  >
): AcademyMember[] {
  const members = getAcademyMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) return members;

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<AcademyMember>;

  const next = [...members];
  next[index] = { ...members[index], ...cleanData };
  writeMembers(next);
  return next;
}

export function assignMemberBatch(
  memberId: number,
  batch: { id: number; name: string } | null
): AcademyMember[] {
  return updateAcademyMember(memberId, {
    batchId: batch?.id ?? null,
    batchName: batch?.name ?? "",
  });
}

export function setAcademyMemberStatus(id: number, status: MemberStatus): AcademyMember[] {
  return updateAcademyMember(id, { status });
}

export function bulkAddAcademyMembers(
  rows: Array<Omit<AcademyMember, "id" | "avatar" | "joinedOn"> & { joinedOn?: string }>
): AcademyMember[] {
  let members = getAcademyMembers();
  let nextId = members.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  const created: AcademyMember[] = rows.map((row) => {
    const member: AcademyMember = {
      ...row,
      id: nextId,
      joinedOn:
        row.joinedOn ??
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      avatar: `https://i.pravatar.cc/100?img=${(nextId % 70) + 1}`,
    };
    nextId += 1;
    return member;
  });
  members = [...created, ...members];
  writeMembers(members);
  return members;
}

export function getMembersByAcademyAndRole(
  academyId: number,
  role: AcademyMemberRole
): AcademyMember[] {
  return getAcademyMembers().filter(
    (m) => m.academyId === academyId && m.role === role
  );
}

export function getMembersForScope(
  role: AcademyMemberRole,
  options: { activeAcademyId?: number | null; allowedAcademyIds?: number[] }
): AcademyMember[] {
  let members = getAcademyMembers().filter((m) => m.role === role);

  if (options.activeAcademyId) {
    return members.filter((m) => m.academyId === options.activeAcademyId);
  }

  if (options.allowedAcademyIds?.length) {
    return members.filter((m) => options.allowedAcademyIds!.includes(m.academyId));
  }

  return members;
}
