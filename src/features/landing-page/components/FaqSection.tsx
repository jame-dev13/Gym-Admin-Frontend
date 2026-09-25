import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/features/landing-page/components/Reveal";
import { getFaqConfig } from "@/features/landing-page/services/FaqConfig";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";

export const FaqSection = () => {
  const faqs = getFaqConfig();
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={LANDING_SECTION_IDS.faq}
      aria-labelledby="faq-title"
      className="scroll-mt-20 border-t border-border"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:py-20">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Frequently asked questions
          </p>
          <h2 id="faq-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Questions?
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const buttonId = `${baseId}-button-${index}`;
              const panelId = `${baseId}-panel-${index}`;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen ? "border-border-emphasis bg-surface-raised" : "border-border bg-surface-raised/60"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold transition-colors hover:text-accent"
                    >
                      {faq.question}
                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : "text-text-secondary"}`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={panelId} role="region" aria-labelledby={buttonId}>
                      <p className="px-5 pb-5 text-text-secondary">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
