export interface AcademyFormData {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
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

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
