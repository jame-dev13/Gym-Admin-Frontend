import { WELCOME_STEPS } from "@/components/welcome/WelcomeContent";
import { WelcomeSectionHeader } from "@/components/welcome/WelcomeSectionHeader";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";

export const WelcomeSteps = () => (
  <section
    id={WELCOME_SECTION_IDS.howItWorks}
    aria-labelledby="welcome-steps-title"
    className="scroll-mt-24 border-t border-border bg-surface-raised/40"
  >
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
      <WelcomeSectionHeader
        id="welcome-steps-title"
        eyebrow="How it works"
        title="From account to all-access in three steps."
        description="No paperwork marathon. No guesswork. Just a clear path into your membership."
        align="center"
      />

      <ol className="grid gap-4 tab:grid-cols-3">
        {WELCOME_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6"
          >
            <span
              aria-hidden="true"
              className="absolute top-5 right-5 text-4xl font-extrabold tracking-tight text-border-emphasis/50"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15">
              <step.Icon size={22} aria-hidden="true" />
            </span>
            <h3 className="pr-10 text-lg font-bold tracking-tight text-text-primary">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <p className="text-center text-sm text-text-tertiary">
        Most members finish setup in about two minutes.
      </p>
    </div>
  </section>
);
