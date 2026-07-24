import { Mail, MapPin, Phone } from "lucide-react";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";
import type { AcademyListItem } from "@/types/academy";

interface LandingFooterProps {
  data: AcademyWebsiteContent;
  academy?: AcademyListItem | null;
}

export default function LandingFooter({ data, academy }: LandingFooterProps) {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {data.logo && (
              <img src={data.logo} alt="" className="h-12 w-12 rounded-xl object-cover border border-white/20" />
            )}
            <div>
              <p className="font-bold text-lg">{data.academyName}</p>
              <p className="text-xs text-white/50">Student Registration Portal</p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{data.description}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/90">Quick Links</h4>
          <div className="space-y-2 text-sm text-white/70">
            <a href="#home" className="block hover:text-white">Home</a>
            {data.showRegistrationForm && (
              <a href="#register" className="block hover:text-white">Student Registration</a>
            )}
            <a href="#features" className="block hover:text-white">Why Join Us</a>
            <a href="#faq" className="block hover:text-white">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/90">Contact</h4>
          <div className="space-y-2.5 text-sm text-white/70">
            {data.contactInfo.mobileNumber && (
              <a href={`tel:${data.contactInfo.mobileNumber}`} className="flex items-center gap-2 hover:text-white">
                <Phone size={14} /> {data.contactInfo.mobileNumber}
              </a>
            )}
            {data.contactInfo.email && (
              <a href={`mailto:${data.contactInfo.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail size={14} /> {data.contactInfo.email}
              </a>
            )}
            {academy && (
              <p className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>
                  {[academy.addressLine1, academy.city, academy.pincode].filter(Boolean).join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {data.academyName}. All rights reserved.
      </div>
    </footer>
  );
}
