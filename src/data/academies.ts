import type { AcademyFormData, AcademyListItem, AcademyStatus } from "@/types/academy";

const STORAGE_KEY = "sports_academy_list";

const INITIAL_ACADEMIES: AcademyListItem[] = [
  {
    id: 1,
    brandId: 1,
    name: "Mumbai Cricket Club",
    logo: "https://ui-avatars.com/api/?name=Mumbai+Cricket&background=1a56db&color=fff&size=80",
    city: "Mumbai",
    type: "Cricket Academy",
    studentCount: 245,
    status: "Active",
    ownerName: "Rahul Sharma",
    email: "rahul@mumbaicricket.com",
    phone: "9876543210",
    addressLine1: "12 Marine Drive",
    addressLine2: "Near Oval Maidan",
    country: "IN",
    state: "MH",
    pincode: "400001",
    about: "Premier cricket academy in Mumbai.",
    establishedYear: "2010",
    facilities: ["Practice Nets", "Turf Ground", "Gym"],
    website: "https://mumbaicricket.com",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 2,
    brandId: 2,
    name: "Delhi Cricket Academy",
    logo: "https://ui-avatars.com/api/?name=Delhi+Cricket&background=7c3aed&color=fff&size=80",
    city: "New Delhi",
    type: "Multi-Sport Academy",
    studentCount: 180,
    status: "Active",
    ownerName: "Arjun Mehta",
    email: "arjun@delhicricket.com",
    phone: "9123456789",
    addressLine1: "45 Ring Road",
    addressLine2: "",
    country: "IN",
    state: "DL",
    pincode: "110001",
    about: "Multi-sport training center in Delhi.",
    establishedYear: "2012",
    facilities: ["Practice Nets", "Indoor Hall"],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 3,
    brandId: 3,
    name: "Bangalore Sports Hub",
    logo: "https://ui-avatars.com/api/?name=Bangalore+Sports&background=059669&color=fff&size=80",
    city: "Bangalore",
    type: "Coaching Center",
    studentCount: 320,
    status: "Inactive",
    ownerName: "Sneha Iyer",
    email: "sneha@blsports.com",
    phone: "9987654321",
    addressLine1: "88 MG Road",
    addressLine2: "Indiranagar",
    country: "IN",
    state: "KA",
    pincode: "560001",
    about: "Coaching center for young athletes.",
    establishedYear: "2018",
    facilities: ["Gym", "Physiotherapy"],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 4,
    brandId: 4,
    name: "Pune Cricket Training",
    logo: "https://ui-avatars.com/api/?name=Pune+Cricket&background=d97706&color=fff&size=80",
    city: "Pune",
    type: "Cricket Academy",
    studentCount: 95,
    status: "Inactive",
    ownerName: "Vikram Singh",
    email: "vikram@punecricket.com",
    phone: "9871234567",
    addressLine1: "22 FC Road",
    addressLine2: "",
    country: "IN",
    state: "MH",
    pincode: "411001",
    about: "Cricket training academy in Pune.",
    establishedYear: "2015",
    facilities: ["Practice Nets"],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 5,
    brandId: 5,
    name: "Chennai Super Kings Academy",
    logo: "https://ui-avatars.com/api/?name=Chennai+SK&background=dc2626&color=fff&size=80",
    city: "Chennai",
    type: "Residential Academy",
    studentCount: 410,
    status: "Active",
    ownerName: "Priya Patel",
    email: "priya@cskacademy.com",
    phone: "9123487654",
    addressLine1: "1 Anna Salai",
    addressLine2: "",
    country: "IN",
    state: "TN",
    pincode: "600001",
    about: "Residential cricket academy.",
    establishedYear: "2008",
    facilities: ["Hostel", "Practice Nets", "Gym", "Swimming Pool"],
    website: "https://cskacademy.com",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 6,
    brandId: 6,
    name: "Kolkata Cricket Academy",
    logo: "https://ui-avatars.com/api/?name=Kolkata+Cricket&background=0891b2&color=fff&size=80",
    city: "Kolkata",
    type: "Multi-Sport Academy",
    studentCount: 156,
    status: "Inactive",
    ownerName: "Karan Verma",
    email: "karan@kolkatacricket.com",
    phone: "9000011122",
    addressLine1: "7 Park Street",
    addressLine2: "",
    country: "IN",
    state: "WB",
    pincode: "700016",
    about: "Multi-sport academy in Kolkata.",
    establishedYear: "2016",
    facilities: ["Turf Ground", "Cafe / Canteen"],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 7,
    brandId: 7,
    name: "Shubham Cricket Academy",
    logo: "https://ui-avatars.com/api/?name=Shubham+Cricket&background=7c3aed&color=fff&size=80",
    city: "Indore",
    type: "Cricket Academy",
    studentCount: 128,
    status: "Active",
    ownerName: "Admin User",
    email: "admin@sportsacademy.com",
    phone: "9876543211",
    addressLine1: "12 Race Course Road",
    addressLine2: "Near Holkar Stadium",
    country: "IN",
    state: "MP",
    pincode: "452001",
    about: "Shubham Cricket Academy — Indore branch.",
    establishedYear: "2019",
    facilities: ["Practice Nets", "Turf Ground", "Gym"],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  {
    id: 8,
    brandId: 7,
    name: "Shubham Cricket Academy",
    logo: "https://ui-avatars.com/api/?name=Shubham+Cricket&background=7c3aed&color=fff&size=80",
    city: "Bhopal",
    type: "Cricket Academy",
    studentCount: 96,
    status: "Active",
    ownerName: "Admin User",
    email: "admin@sportsacademy.com",
    phone: "9876543211",
    addressLine1: "45 Arera Colony",
    addressLine2: "Bittan Market",
    country: "IN",
    state: "MP",
    pincode: "462016",
    about: "Shubham Cricket Academy — Bhopal branch.",
    establishedYear: "2021",
    facilities: ["Practice Nets", "Indoor Hall"],
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
];

function normalizeAcademies(list: AcademyListItem[]): AcademyListItem[] {
  return list.map((academy) => {
    const rawStatus = academy.status as string;
    const status: AcademyListItem["status"] =
      rawStatus === "Active" ? "Active" : "Inactive";
    return {
      ...academy,
      brandId: academy.brandId ?? academy.id,
      status,
    };
  });
}

function mergeWithSeed(stored: AcademyListItem[]): AcademyListItem[] {
  const normalizedStored = normalizeAcademies(stored);
  const merged = [...normalizedStored];

  for (const seed of INITIAL_ACADEMIES) {
    const index = merged.findIndex((a) => a.id === seed.id);
    if (index === -1) {
      merged.push(seed);
    } else if (!merged[index].brandId) {
      merged[index] = { ...merged[index], brandId: seed.brandId };
    }
  }

  return normalizeAcademies(merged);
}

function readStorage(): AcademyListItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeWithSeed(JSON.parse(raw) as AcademyListItem[]);
  } catch {
    return null;
  }
}

function writeStorage(list: AcademyListItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeAcademies(list)));
  window.dispatchEvent(new Event("academiesUpdated"));
}

export function getAcademies(): AcademyListItem[] {
  const stored = readStorage();
  if (stored && stored.length > 0) {
    const merged = mergeWithSeed(stored);
    if (merged.length !== stored.length) writeStorage(merged);
    return merged;
  }
  writeStorage(INITIAL_ACADEMIES);
  return INITIAL_ACADEMIES;
}

export function getAcademyById(id: number): AcademyListItem | undefined {
  return getAcademies().find((a) => a.id === id);
}

export function getAcademiesByBrandId(brandId: number): AcademyListItem[] {
  return getAcademies().filter((a) => a.brandId === brandId);
}

export function getLocationIdsByBrandId(brandId: number): number[] {
  return getAcademiesByBrandId(brandId).map((a) => a.id);
}

export function getBrandById(brandId: number): AcademyListItem | undefined {
  return getAcademiesByBrandId(brandId)[0];
}

export function updateAcademyStatus(id: number, status: AcademyStatus): AcademyListItem[] {
  const list = getAcademies().map((a) => (a.id === id ? { ...a, status } : a));
  writeStorage(list);
  return list;
}

export function archiveAcademy(id: number): AcademyListItem[] {
  return updateAcademyStatus(id, "Inactive");
}

export function updateAcademy(id: number, form: AcademyFormData): AcademyListItem[] {
  const list = getAcademies().map((a) =>
    a.id === id
      ? {
          ...a,
          name: form.name,
          ownerName: form.ownerName,
          email: form.email,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          country: form.country,
          state: form.state,
          city: form.city,
          pincode: form.pincode,
          about: form.about,
          establishedYear: form.establishedYear,
          type: form.academyType,
          facilities: form.facilities,
          website: form.website,
          instagram: form.instagram,
          facebook: form.facebook,
          youtube: form.youtube,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=1a56db&color=fff&size=80`,
        }
      : a
  );
  writeStorage(list);
  return list;
}

export function createAcademy(form: AcademyFormData): AcademyListItem[] {
  const list = getAcademies();
  const nextId = list.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const academy: AcademyListItem = {
    id: nextId,
    brandId: nextId,
    name: form.name,
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=1a56db&color=fff&size=80`,
    city: form.city,
    type: form.academyType,
    studentCount: 0,
    status: "Inactive",
    ownerName: form.ownerName,
    email: form.email,
    phone: form.phone,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    country: form.country,
    state: form.state,
    pincode: form.pincode,
    about: form.about,
    establishedYear: form.establishedYear,
    facilities: form.facilities,
    website: form.website,
    instagram: form.instagram,
    facebook: form.facebook,
    youtube: form.youtube,
  };
  const next = [academy, ...list];
  writeStorage(next);
  return next;
}

export function createAcademyLocation(
  brandId: number,
  form: AcademyFormData
): AcademyListItem[] | { error: string } {
  const brand = getBrandById(brandId);
  if (!brand) return { error: "Academy brand not found." };

  const list = getAcademies();
  const nextId = list.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const location: AcademyListItem = {
    id: nextId,
    brandId,
    name: brand.name,
    logo: brand.logo,
    city: form.city,
    type: form.academyType || brand.type,
    studentCount: 0,
    status: "Active",
    ownerName: brand.ownerName,
    email: brand.email,
    phone: brand.phone,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    country: form.country,
    state: form.state,
    pincode: form.pincode,
    about: form.about || `${brand.name} — ${form.city} branch.`,
    establishedYear: form.establishedYear || brand.establishedYear,
    facilities: form.facilities.length ? form.facilities : brand.facilities,
    website: brand.website,
    instagram: brand.instagram,
    facebook: brand.facebook,
    youtube: brand.youtube,
  };

  writeStorage([location, ...list]);
  return getAcademies();
}
