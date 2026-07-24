import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingRulesProps {
  data: AcademyWebsiteContent;
}

export default function LandingRules({ data }: LandingRulesProps) {
  const items = data.rules?.items ?? [];
  if (!items.length) return null;

  return (
    <section id="rules" className="py-20 md:py-28 bg-[#F5F3FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12" data-reveal>
          <h2 className="landing-display text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {data.rules.title || "Guidelines"}
          </h2>
          <div data-line className="mt-5 h-1 w-16 rounded-full bg-[var(--landing-accent)] origin-left" />
          {data.rules.description && (
            <p className="mt-5 text-slate-600 text-base md:text-lg font-medium">{data.rules.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-reveal-stagger>
          {items.map((item, idx) => (
            <article
              key={item.id}
              data-reveal-child
              className="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-violet-100/50"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black text-white mb-4"
                style={{ background: "var(--landing-accent)" }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
