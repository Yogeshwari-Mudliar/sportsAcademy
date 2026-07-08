export interface AcademyFormData {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  /** ISO country code, e.g. "IN" */
  country: string;
  /** ISO state code, e.g. "MH" */
  state: string;
  city: string;
  pincode: string;
  about: string;
  establishedYear: string;
  academyType: string;
  facilities: string[];
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export type AcademyStatus = "Active" | "Inactive" | "Pending";

export interface AcademyListItem {
  id: number;
  name: string;
  logo: string;
  city: string;
  type: string;
  studentCount: number;
  status: AcademyStatus;
  ownerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  pincode: string;
  about: string;
  establishedYear: string;
  facilities: string[];
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export const ACADEMY_TYPES = [
  "Cricket Academy",
  "Multi-Sport Academy",
  "Coaching Center",
  "Residential Academy",
];

export const ACADEMY_FACILITIES = [
  "Practice Nets",
  "Turf Ground",
  "Bowling Machine",
  "Gym",
  "Hostel",
  "Indoor Hall",
  "Video Analysis",
  "Physiotherapy",
  "Swimming Pool",
  "Cafe / Canteen",
  "Other",
];

export const EMPTY_ACADEMY_FORM: AcademyFormData = {
  name: "",
  ownerName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  country: "",
  city: "",
  state: "",
  pincode: "",
  about: "",
  establishedYear: "",
  academyType: "",
  facilities: [],
  website: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

export function academyToFormData(academy: AcademyListItem): AcademyFormData {
  return {
    name: academy.name,
    ownerName: academy.ownerName,
    email: academy.email,
    phone: academy.phone,
    addressLine1: academy.addressLine1,
    addressLine2: academy.addressLine2,
    country: academy.country,
    state: academy.state,
    city: academy.city,
    pincode: academy.pincode,
    about: academy.about,
    establishedYear: academy.establishedYear,
    academyType: academy.type,
    facilities: academy.facilities,
    website: academy.website,
    instagram: academy.instagram,
    facebook: academy.facebook,
    youtube: academy.youtube,
  };
}
