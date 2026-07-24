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

  const navItems = [
    { label: "Home", href: "#home" },
    ...(data.showRegistrationForm
      ? [{ label: "Register", href: "#register" }]
      : []),
    { label: "Features", href: "#features" },
    { label: "Guidelines", href: "#rules" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
  ];

  const socials = [...(data.socialAccounts || [])].sort((a, b) => a.order - b.order);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{
        background: scrolled ? "rgba(15, 23, 42, 0.96)" : "rgba(15, 23, 42, 0.92)",
        borderColor: "rgba(255,255,255,0.12)",
        color: "#f8fafc",
      }}
    >
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-2 items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-white/80">
          {data.contactInfo.mobileNumber && (
            <a href={`tel:${data.contactInfo.mobileNumber}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Phone size={12} /> {data.contactInfo.mobileNumber}
            </a>
          )}
          {data.contactInfo.email && (
            <a href={`mailto:${data.contactInfo.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail size={12} /> {data.contactInfo.email}
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = platformIcons[s.platform];
            if (!Icon || !s.url) return null;
            return (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="hover:text-[var(--landing-accent)] transition">
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3 min-w-0">
          {data.logo ? (
            <img src={data.logo} alt="" className="h-11 w-11 rounded-xl object-cover border border-white/30" />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              {data.academyName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-base sm:text-lg truncate">{data.academyName}</p>
            <p className="text-[11px] text-white/60 truncate">{data.academyTitle}</p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              {item.label}
            </a>
          ))}
          {data.showRegistrationForm && (
            <a
              href="#register"
              className="ml-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--landing-accent)" }}
            >
              Join Now
            </a>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg border border-white/20"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1 bg-slate-950/95">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
          <Link to="/" className="block px-3 py-2.5 text-sm text-white/50">
            Academy Login
          </Link>
        </div>
      )}
    </header>
  );
}
