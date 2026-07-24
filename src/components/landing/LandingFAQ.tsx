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
    <section id="faq" className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: "color-mix(in srgb, var(--landing-accent) 12%, white)",
              color: "var(--landing-accent)",
            }}
          >
            <MessageCircle size={13} /> Need Help?
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <article
                key={faq.id}
                className={`rounded-2xl border bg-white overflow-hidden transition ${
                  open ? "border-orange-200 shadow-md" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
                >
                  <span className="font-semibold text-slate-900 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
