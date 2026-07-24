import { CheckCircle } from "lucide-react";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingFeaturesProps {
  data: AcademyWebsiteContent;
}

export default function LandingFeatures({ data }: LandingFeaturesProps) {
  const features = data.keyFeatures?.features ?? [];
  if (!features.length) return null;

  return (
    <section id="features" className="relative py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl" data-reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-violet-500 font-semibold mb-3">
            Why join
          </p>
          <h2 className="landing-display text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {data.keyFeatures.title || "Why Join Us"}
          </h2>
          <div data-line className="mt-5 h-1 w-16 rounded-full bg-[var(--landing-accent)] origin-left" />
          <p className="mt-5 text-slate-600 max-w-2xl text-base md:text-lg font-medium">
            Everything students need to grow at {data.academyName}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-reveal-stagger>
          {features.map((feature) => (
            <article
              key={feature.id}
              data-reveal-child
              className="group rounded-3xl border border-violet-100 bg-[#FBFBFF] p-6 shadow-sm shadow-violet-100/60 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <h3 className="font-bold uppercase tracking-wide text-sm text-slate-900">
                  {feature.title}
                </h3>
                <CheckCircle size={18} style={{ color: "var(--landing-accent)" }} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
