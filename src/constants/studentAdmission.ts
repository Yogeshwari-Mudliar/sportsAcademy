export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

/** Sport-agnostic playing role / position options */
export const PLAYING_ROLES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All-Rounder",
  "Batsman / Batter",
  "Bowler / Pitcher",
  "Wicket Keeper / Goalkeeper",
  "Fielder / Defender",
  "Other",
] as const;

export interface StudentAdmissionData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  parentName: string;
  parentPhone: string;
  playingRole: string;
  sportExperience: string;
  address: string;
  city: string;
}

export const EMPTY_STUDENT_ADMISSION: StudentAdmissionData = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "Male",
  bloodGroup: "Unknown",
  parentName: "",
  parentPhone: "",
  playingRole: "Beginner",
  sportExperience: "",
  address: "",
  city: "",
};

export function parseStudentAdmissionForm(
  fd: FormData
): StudentAdmissionData {
  return {
    name: String(fd.get("name") ?? "").trim(),
    email: String(fd.get("email") ?? "").trim(),
    phone: String(fd.get("phone") ?? "").trim(),
    dateOfBirth: String(fd.get("dateOfBirth") ?? ""),
    gender: (String(fd.get("gender") ?? "Male") as StudentAdmissionData["gender"]) || "Male",
    bloodGroup: String(fd.get("bloodGroup") ?? "Unknown"),
    parentName: String(fd.get("parentName") ?? "").trim(),
    parentPhone: String(fd.get("parentPhone") ?? "").trim(),
    playingRole: String(fd.get("playingRole") ?? "Beginner"),
    sportExperience: String(fd.get("sportExperience") ?? fd.get("experience") ?? "").trim(),
    address: String(fd.get("address") ?? "").trim(),
    city: String(fd.get("city") ?? "").trim(),
  };
}
