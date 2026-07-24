import { getAcademyById } from "./academies";
import type { AcademyListItem } from "@/types/academy";

export interface WebsiteContactInfo {
  email: string;
  mobileNumber: string;
  phoneNumber: string;
  website: string;
}

export interface WebsiteSocialAccount {
  id: string;
  platform: "facebook" | "instagram" | "youtube" | "twitter" | "linkedin";
  url: string;
  order: number;
}

export interface WebsiteFeature {
  id: string;
  title: string;
  description: string;
}

export interface WebsiteRuleItem {
  id: string;
  title: string;
  description: string;
}

export interface WebsiteGalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface WebsiteFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface WebsiteSliderImage {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

export interface AcademyWebsiteContent {
  academyId: number;
  academyTitle: string;
  academyName: string;
  description: string;
  logo: string;
  sliderImages: WebsiteSliderImage[];
  contactInfo: WebsiteContactInfo;
  socialAccounts: WebsiteSocialAccount[];
  keyFeatures: { title: string; features: WebsiteFeature[] };
  rules: { title: string; description: string; items: WebsiteRuleItem[] };
  galleryImages: WebsiteGalleryImage[];
  questionsAnswers: WebsiteFAQ[];
  showRegistrationForm: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  primaryColor: string;
  accentColor: string;
  /** Soft watermark overlay on hero banner (URL or data-URL) */
  heroWatermark: string;
  updatedAt: string;
}

const STORAGE_KEY = "academy_websites";
export const WEBSITE_UPDATED_EVENT = "academyWebsiteUpdated";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDefaultWebsite(academy: AcademyListItem): AcademyWebsiteContent {
  return {
    academyId: academy.id,
    academyTitle: `${academy.name} — Student Registration`,
    academyName: academy.name,
    description:
      academy.about ||
      `Join ${academy.name} in ${academy.city}. Professional cricket coaching for students of all levels.`,
    logo: academy.logo,
    sliderImages: [
      {
        id: uid(),
        imageUrl:
          "https://images.unsplash.com/photo-1531415079815-0bced8e8a59c?w=1600&q=80",
        title: `Welcome to ${academy.name}`,
        subtitle: "Train. Improve. Compete.",
      },
      {
        id: uid(),
        imageUrl:
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&q=80",
        title: "World-class Coaching",
        subtitle: "Expert coaches. Modern facilities.",
      },
    ],
    contactInfo: {
      email: academy.email || "",
      mobileNumber: academy.phone || "",
      phoneNumber: "",
      website: academy.website || "",
    },
    socialAccounts: [
      academy.instagram
        ? { id: uid(), platform: "instagram" as const, url: academy.instagram, order: 1 }
        : null,
      academy.facebook
        ? { id: uid(), platform: "facebook" as const, url: academy.facebook, order: 2 }
        : null,
      academy.youtube
        ? { id: uid(), platform: "youtube" as const, url: academy.youtube, order: 3 }
        : null,
    ].filter(Boolean) as WebsiteSocialAccount[],
    keyFeatures: {
      title: "Why Join Us",
      features: [
        {
          id: uid(),
          title: "Expert Coaches",
          description: "Learn from certified coaches with professional experience.",
        },
        {
          id: uid(),
          title: "Modern Facilities",
          description:
            academy.facilities?.length
              ? academy.facilities.slice(0, 3).join(", ")
              : "Practice nets, turf ground and training equipment.",
        },
        {
          id: uid(),
          title: "Age-group Batches",
          description: "Structured batches for beginners, intermediate and advanced students.",
        },
        {
          id: uid(),
          title: "Performance Tracking",
          description: "Regular assessments and progress reports for every student.",
        },
      ],
    },
    rules: {
      title: "Admission Guidelines",
      description: "Please read the academy guidelines before registering.",
      items: [
        {
          id: uid(),
          title: "Attendance",
          description: "Students are expected to attend scheduled batch sessions regularly.",
        },
        {
          id: uid(),
          title: "Safety Gear",
          description: "Proper cricket kit and safety equipment are mandatory during practice.",
        },
        {
          id: uid(),
          title: "Fees",
          description: "Registration is confirmed after fee payment as per academy policy.",
        },
      ],
    },
    galleryImages: [
      {
        id: uid(),
        imageUrl:
          "https://images.unsplash.com/photo-1531415079815-0bced8e8a59c?w=800&q=80",
        caption: "Practice session",
      },
      {
        id: uid(),
        imageUrl:
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
        caption: "Match day",
      },
      {
        id: uid(),
        imageUrl:
          "https://images.unsplash.com/photo-1461897104016-0b3b00cc134d?w=800&q=80",
        caption: "Team huddle",
      },
    ],
    questionsAnswers: [
      {
        id: uid(),
        question: "Who can register as a student?",
        answer:
          "Students of all age groups can register. Batch allocation depends on age and skill level.",
      },
      {
        id: uid(),
        question: "What documents are required?",
        answer: "A valid phone number, email, and parent/guardian contact for minors.",
      },
      {
        id: uid(),
        question: "How do I know my registration is confirmed?",
        answer:
          "After submitting the form, the academy team will review and confirm your admission.",
      },
    ],
    showRegistrationForm: true,
    isActive: true,
    metaTitle: `${academy.name} | Student Registration`,
    metaDescription: academy.about || `Register as a student at ${academy.name}.`,
    primaryColor: "#312E81",
    accentColor: "#7C3AED",
    heroWatermark: "",
    updatedAt: new Date().toISOString(),
  };
}

function readAll(): Record<string, AcademyWebsiteContent> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, AcademyWebsiteContent>;
  } catch {
    /* ignore */
  }
  return {};
}

function writeAll(map: Record<string, AcademyWebsiteContent>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(WEBSITE_UPDATED_EVENT));
}

export function getAcademyWebsite(academyId: number): AcademyWebsiteContent | null {
  const stored = readAll()[String(academyId)];
  const academy = getAcademyById(academyId);
  if (!academy && !stored) return null;
  if (stored) {
    return {
      ...stored,
      showRegistrationForm: stored.showRegistrationForm !== false,
      isActive: stored.isActive !== false,
      heroWatermark: stored.heroWatermark || "",
      primaryColor: stored.primaryColor || "#312E81",
      accentColor: stored.accentColor || "#7C3AED",
    };
  }
  if (!academy) return null;
  return createDefaultWebsite(academy);
}

export function saveAcademyWebsite(content: AcademyWebsiteContent): AcademyWebsiteContent {
  const map = readAll();
  const next = { ...content, updatedAt: new Date().toISOString() };
  map[String(content.academyId)] = next;
  writeAll(map);
  return next;
}

export function getPublicAcademyWebsite(academyId: number): AcademyWebsiteContent | null {
  const content = getAcademyWebsite(academyId);
  if (!content || !content.isActive) return null;
  return content;
}

export function getLandingPageUrl(academyId: number): string {
  return `${window.location.origin}/register/${academyId}`;
}

export { uid as createWebsiteId };
