import { ChevronDown } from "lucide-react";
import { WELCOME_FAQS } from "@/components/welcome/WelcomeContent";
import { WelcomeSectionHeader } from "@/components/welcome/WelcomeSectionHeader";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";

export const WelcomeFaq = () => (
  <section
    id={WELCOME_SECTION_IDS.faq}
    aria-labelledby="welcome-faq-title"
    className="scroll-mt-24 border-t border-border bg-surface-raised/40"
  >
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20">
      <WelcomeSectionHeader
        id="welcome-faq-title"
        eyebrow="Frequently asked questions"
        title="Everything you might be wondering."
        description="Still unsure? These are the questions new members ask us most often."
        align="center"
      />

      <div className="flex flex-col gap-3">
        {WELCOME_FAQS.map((faq) => (
          <details
            key={faq.question}
            className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 open:border-border-emphasis"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-text-primary transition-colors duration-200 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:outline-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown
                size={20}
                aria-hidden="true"
                className="shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-text-secondary">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
