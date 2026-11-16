import { Check } from "lucide-react";
import { WELCOME_BENEFITS } from "@/components/welcome/WelcomeContent";
import { WelcomeSectionHeader } from "@/components/welcome/WelcomeSectionHeader";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";

export const WelcomeBenefits = () => (
  <section
    id={WELCOME_SECTION_IDS.benefits}
    aria-labelledby="welcome-benefits-title"
    className="scroll-mt-24 border-t border-border bg-surface-raised/40"
  >
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
      <WelcomeSectionHeader
        id="welcome-benefits-title"
        eyebrow="Member benefits"
        title="Less admin. More momentum."
        description="A membership gives you one calm place to handle the practical side of training, so you can spend your energy on the work that matters."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {WELCOME_BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-border-emphasis"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/15">
              <benefit.Icon size={24} aria-hidden="true" />
            </span>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold tracking-tight text-text-primary">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {benefit.description}
              </p>
            </div>

            <ul className="mt-auto flex flex-col gap-2 pt-1">
              {benefit.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <Check
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-success"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
