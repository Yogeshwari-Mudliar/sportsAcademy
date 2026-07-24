import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingRulesProps {
  data: AcademyWebsiteContent;
}

export default function LandingRules({ data }: LandingRulesProps) {
  const items = data.rules?.items ?? [];
  if (!items.length) return null;

  return (
    <section id="rules" className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            {data.rules.title || "Guidelines"}
          </h2>
          {data.rules.description && (
            <p className="mt-3 text-slate-600">{data.rules.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white mb-3"
                style={{ background: "var(--landing-primary)" }}
              >
                {idx + 1}
              </span>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
