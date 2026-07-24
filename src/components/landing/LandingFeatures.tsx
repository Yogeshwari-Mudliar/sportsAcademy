import { CheckCircle } from "lucide-react";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingFeaturesProps {
  data: AcademyWebsiteContent;
}

export default function LandingFeatures({ data }: LandingFeaturesProps) {
  const features = data.keyFeatures?.features ?? [];
  if (!features.length) return null;

  return (
    <section id="features" className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            {data.keyFeatures.title || "Why Join Us"}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Everything students need to grow as cricketers at {data.academyName}.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <article
              key={feature.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition"
              style={{ borderLeft: "4px solid var(--landing-accent)" }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wide text-sm">
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
