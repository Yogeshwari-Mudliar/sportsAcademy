import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";

interface LandingFAQProps {
  data: AcademyWebsiteContent;
}

export default function LandingFAQ({ data }: LandingFAQProps) {
  const faqs = data.questionsAnswers ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!faqs.length) return null;

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#F5F3FF]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12" data-reveal>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-white text-[var(--landing-accent)] shadow-sm"
          >
            <MessageCircle size={13} /> Need Help?
          </span>
          <h2 className="landing-display mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <div data-line className="mx-auto mt-6 h-1 w-16 rounded-full bg-[var(--landing-accent)] origin-left" />
        </div>
        <div className="space-y-3" data-reveal-stagger>
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <article
                key={faq.id}
                data-reveal-child
                className={`rounded-3xl border overflow-hidden bg-white transition ${
                  open ? "border-violet-200 shadow-md shadow-violet-100" : "border-violet-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
                >
                  <span className="font-semibold text-sm md:text-base text-slate-900">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-violet-50 pt-3">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
