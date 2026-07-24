import { useEffect, useState } from "react";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingSliderProps {
  data: AcademyWebsiteContent;
}

export default function LandingSlider({ data }: LandingSliderProps) {
  const slides = data.sliderImages?.filter((s) => s.imageUrl) ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <section
        id="home"
        className="relative min-h-[420px] md:min-h-[520px] flex items-center justify-center text-white"
        style={{ background: "linear-gradient(135deg, var(--landing-primary), #1e3a5f)" }}
      >
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{data.academyTitle}</h1>
          <p className="mt-4 text-white/80 text-base md:text-lg">{data.description}</p>
          {data.showRegistrationForm && (
            <a
              href="#register"
              className="inline-flex mt-8 px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: "var(--landing-accent)" }}
            >
              Register as Student
            </a>
          )}
        </div>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section id="home" className="relative min-h-[420px] md:min-h-[560px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/30" />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 min-h-[420px] md:min-h-[560px] flex items-center">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
            {data.academyName}
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {slide.title || data.academyTitle}
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80">
            {slide.subtitle || data.description}
          </p>
          {data.showRegistrationForm && (
            <a
              href="#register"
              className="inline-flex mt-8 px-6 py-3 rounded-xl font-semibold text-white shadow-lg"
              style={{ background: "var(--landing-accent)" }}
            >
              Register as Student
            </a>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
