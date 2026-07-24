import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingSliderProps {
  data: AcademyWebsiteContent;
}

/** Habitline-inspired soft light hero — text and image never overlap */
export default function LandingSlider({ data }: LandingSliderProps) {
  const slides = data.sliderImages?.filter((s) => s.imageUrl) ?? [];
  const [index, setIndex] = useState(0);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const copy = copyRef.current;
    if (!copy || reduce) return;
    const lines = copy.querySelectorAll("[data-split]");
    const tl = gsap.timeline();
    tl.fromTo(
      lines,
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" }
    ).fromTo(
      copy.querySelectorAll("[data-hero-cta]"),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power2.out" },
      "-=0.35"
    );
    return () => {
      tl.kill();
    };
  }, [index, slides.length]);

  const title = slides[index]?.title || data.academyTitle;
  const subtitle = slides[index]?.subtitle || data.description;
  const bg = slides[index]?.imageUrl;
  const watermark = data.heroWatermark;

  return (
    <section id="home" className="landing-hero relative min-h-[92svh] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#F5F3FF_0%,#EEF2FF_42%,#F8FAFC_100%)]" />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-[28rem] w-[28rem] rounded-full blur-[90px]"
        style={{ background: "color-mix(in srgb, var(--landing-accent) 22%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 h-[22rem] w-[22rem] rounded-full blur-[80px]"
        style={{ background: "color-mix(in srgb, var(--landing-primary) 16%, transparent)" }}
      />

      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-7xl items-center gap-10 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:gap-14">
        {/* Copy — own column so it never sits under the image */}
        <div ref={copyRef} className="relative z-20 max-w-xl lg:max-w-none">
          <div className="mb-4 overflow-hidden">
            <p
              data-split
              className="inline-flex items-center rounded-full border border-indigo-100 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--landing-primary)] shadow-sm backdrop-blur"
            >
              {data.academyName}
            </p>
          </div>

          <div className="mb-5 overflow-hidden">
            <h1
              data-split
              className="landing-display text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-[3.25rem]"
            >
              {title}
            </h1>
          </div>

          <div className="mb-9 max-w-lg overflow-hidden">
            <p data-split className="text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {data.showRegistrationForm && (
              <a
                data-hero-cta
                data-magnetic
                href="#register"
                className="magnetic inline-flex items-center rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-300/40"
                style={{ background: "var(--landing-accent)" }}
              >
                Register as Student
              </a>
            )}
            <a
              data-hero-cta
              data-magnetic
              href="#features"
              className="magnetic inline-flex rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur hover:border-violet-200"
            >
              Explore academy
            </a>
          </div>
        </div>

        {/* Image column — watermark stays inside this box only */}
        <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] rounded-br-[3.5rem] shadow-2xl shadow-indigo-200/50 sm:aspect-[5/4] lg:aspect-auto lg:min-h-[28rem] lg:h-[min(70vh,520px)]">
            {bg ? (
              <img src={bg} alt="" className="h-full w-full object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--landing-primary) 18%, #EEF2FF), color-mix(in srgb, var(--landing-accent) 22%, #F5F3FF))",
                }}
              />
            )}
            {watermark && (
              <img
                src={watermark}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 m-auto h-[70%] w-[70%] object-contain opacity-[0.22] mix-blend-multiply select-none"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-900/10 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-9 bg-[var(--landing-accent)]"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
