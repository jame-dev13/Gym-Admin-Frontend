import { Reveal } from "@/features/landing-page/components/Reveal";
import { getBenefitsConfig } from "@/features/landing-page/services/BenefitsConfig";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";

export const BenefitsSection = () => {
  const benefits = getBenefitsConfig();
  return (
    <section
      id={LANDING_SECTION_IDS.benefits}
      aria-labelledby="benefits-title"
      className="scroll-mt-20 border-t border-border bg-surface-raised/40"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:py-20">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Benefits
          </p>
          <h2 id="benefits-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to never quit
          </h2>
          <p className="text-lg text-text-secondary">
            More than machines: a community, a plan, and real guidance in every
            workout.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={Math.min(index * 80, 400)}>
              <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface-raised p-6 transition-colors hover:border-border-emphasis">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <benefit.Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
