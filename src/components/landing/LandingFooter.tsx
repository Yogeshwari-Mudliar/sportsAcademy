import { Mail, MapPin, Phone } from "lucide-react";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";
import type { AcademyListItem } from "@/types/academy";

interface LandingFooterProps {
  data: AcademyWebsiteContent;
  academy?: AcademyListItem | null;
}

export default function LandingFooter({ data, academy }: LandingFooterProps) {
  return (
    <footer className="relative border-t border-violet-100 bg-[linear-gradient(180deg,#F8F7FF_0%,#EEF2FF_55%,#F5F3FF_100%)] text-slate-700">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--landing-accent) 45%, transparent), transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {data.logo ? (
              <img
                src={data.logo}
                alt=""
                className="h-12 w-12 rounded-2xl object-cover border border-violet-100 shadow-sm bg-white"
              />
            ) : (
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm"
                style={{ background: "var(--landing-accent)" }}
              >
                {data.academyName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="landing-display font-bold text-lg text-slate-900 truncate">
                {data.academyName}
              </p>
              <p className="text-xs text-slate-500">Student Registration Portal</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
            {data.description}
          </p>
        </div>

        <div>
          <h4 className="landing-display font-bold mb-4 text-sm uppercase tracking-[0.18em] text-slate-900">
            Quick Links
          </h4>
          <div className="space-y-2.5 text-sm text-slate-600">
            <a href="#home" className="block hover:text-[var(--landing-accent)] transition">
              Home
            </a>
            {data.showRegistrationForm && (
              <a href="#register" className="block hover:text-[var(--landing-accent)] transition">
                Student Registration
              </a>
            )}
            <a href="#features" className="block hover:text-[var(--landing-accent)] transition">
              Why Join Us
            </a>
            <a href="#faq" className="block hover:text-[var(--landing-accent)] transition">
              FAQ
            </a>
          </div>
        </div>

        <div>
          <h4 className="landing-display font-bold mb-4 text-sm uppercase tracking-[0.18em] text-slate-900">
            Contact
          </h4>
          <div className="space-y-3 text-sm text-slate-600">
            {data.contactInfo.mobileNumber && (
              <a
                href={`tel:${data.contactInfo.mobileNumber}`}
                className="flex items-center gap-2.5 hover:text-[var(--landing-accent)] transition"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-violet-100 text-[var(--landing-accent)] shadow-sm">
                  <Phone size={14} />
                </span>
                {data.contactInfo.mobileNumber}
              </a>
            )}
            {data.contactInfo.email && (
              <a
                href={`mailto:${data.contactInfo.email}`}
                className="flex items-center gap-2.5 min-w-0 hover:text-[var(--landing-accent)] transition"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-violet-100 text-[var(--landing-accent)] shadow-sm">
                  <Mail size={14} />
                </span>
                <span className="break-all">{data.contactInfo.email}</span>
              </a>
            )}
            {academy && (
              <p className="flex items-start gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-violet-100 text-[var(--landing-accent)] shadow-sm">
                  <MapPin size={14} />
                </span>
                <span>
                  {[academy.addressLine1, academy.city, academy.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-violet-100/80 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {data.academyName}. All rights reserved.
      </div>
    </footer>
  );
}
