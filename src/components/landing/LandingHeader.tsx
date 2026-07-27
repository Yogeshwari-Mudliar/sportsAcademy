import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Menu, X } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";

const platformIcons = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
} as const;

interface LandingHeaderProps {
  data: AcademyWebsiteContent;
}

export default function LandingHeader({ data }: LandingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const navItems = [
    { label: "Home", href: "#home" },
    ...(data.showRegistrationForm ? [{ label: "Register", href: "#register" }] : []),
    { label: "Features", href: "#features" },
    { label: "Guidelines", href: "#rules" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
  ];

  const socials = [...(data.socialAccounts || [])].sort((a, b) => a.order - b.order);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "shadow-lg shadow-violet-100/60" : ""
      }`}
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(245,243,255,0.82)",
        borderColor: "rgba(124,58,237,0.12)",
      }}
    >
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-2 items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4 min-w-0">
          {data.contactInfo.email && (
            <a
              href={`mailto:${data.contactInfo.email}`}
              className="inline-flex items-center gap-1.5 truncate hover:text-[var(--landing-accent)]"
            >
              <Mail size={12} className="shrink-0" />
              <span className="truncate">{data.contactInfo.email}</span>
            </a>
          )}
          {data.contactInfo.mobileNumber && (
            <a
              href={`tel:${data.contactInfo.mobileNumber}`}
              className="inline-flex items-center gap-1.5 shrink-0 hover:text-[var(--landing-accent)]"
            >
              <Phone size={12} /> {data.contactInfo.mobileNumber}
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = platformIcons[s.platform];
            if (!Icon || !s.url) return null;
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--landing-accent)] transition"
              >
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <a href="#home" className="flex items-center gap-3 min-w-0 flex-1">
          {data.logo ? (
            <img
              src={data.logo}
              alt=""
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl object-cover border border-violet-100 shadow-sm shrink-0"
            />
          ) : (
            <div
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0"
              style={{ background: "var(--landing-accent)" }}
            >
              {data.academyName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="landing-display font-bold text-sm sm:text-lg truncate text-slate-900">
              {data.academyName}
            </p>
            <p className="text-[11px] text-slate-500 truncate hidden sm:block">{data.academyTitle}</p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-violet-50 transition"
            >
              {item.label}
            </a>
          ))}
          {data.showRegistrationForm && (
            <a
              href="#register"
              data-magnetic
              className="magnetic ml-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md shadow-violet-200"
              style={{ background: "var(--landing-accent)" }}
            >
              Join Now
            </a>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden p-2.5 rounded-xl border border-violet-100 bg-white shrink-0"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-violet-100 px-4 py-3 space-y-1 bg-white/95 max-h-[min(70vh,520px)] overflow-y-auto">
          {(data.contactInfo.email || data.contactInfo.mobileNumber) && (
            <div className="px-3 py-2 mb-2 rounded-xl bg-violet-50/80 text-xs text-slate-600 space-y-1.5">
              {data.contactInfo.mobileNumber && (
                <a href={`tel:${data.contactInfo.mobileNumber}`} className="flex items-center gap-2">
                  <Phone size={12} /> {data.contactInfo.mobileNumber}
                </a>
              )}
              {data.contactInfo.email && (
                <a href={`mailto:${data.contactInfo.email}`} className="flex items-center gap-2 break-all">
                  <Mail size={12} className="shrink-0" /> {data.contactInfo.email}
                </a>
              )}
            </div>
          )}
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-violet-50"
            >
              {item.label}
            </a>
          ))}
          {data.showRegistrationForm && (
            <a
              href="#register"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-3 py-3 rounded-xl text-sm font-bold text-center text-white"
              style={{ background: "var(--landing-accent)" }}
            >
              Join Now
            </a>
          )}
          <Link to="/" className="block px-3 py-2.5 text-sm text-slate-400 text-center">
            Academy Login
          </Link>
        </div>
      )}
    </header>
  );
}
