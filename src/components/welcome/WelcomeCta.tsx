import { ArrowRight, Check, Sparkles } from "lucide-react";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import type { WelcomeMembershipActionProps } from "@/components/welcome/WelcomeTypes";

const CTA_POINTS = [
  "No sign-up fees",
  "Cancel anytime",
  "Support when you need it",
] as const;

const PRIMARY_CTA = [
  "inline-flex",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-full",
  "bg-accent",
  "px-7",
  "py-3",
  "font-semibold",
  "text-surface",
  "transition-colors",
  "duration-200",
  "hover:bg-accent-emphasis",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
].join(" ");

const SECONDARY_CTA = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-full",
  "border",
  "border-border-emphasis",
  "px-7",
  "py-3",
  "font-semibold",
  "text-text-primary",
  "transition-colors",
  "duration-200",
  "hover:border-accent",
  "hover:text-accent",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
].join(" ");

export const WelcomeCta = ({
  onRequestMembership,
}: WelcomeMembershipActionProps) => (
  <section
    id={WELCOME_SECTION_IDS.join}
    aria-labelledby="welcome-cta-title"
    className="scroll-mt-24 border-t border-border"
  >
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface-raised px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-accent uppercase">
            <Sparkles size={14} aria-hidden="true" />
            Your next chapter
          </p>

          <h2
            id="welcome-cta-title"
            className="max-w-2xl text-3xl font-extrabold tracking-tight text-balance text-text-primary sm:text-4xl"
          >
            Ready to make your membership official?
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Activate your membership whenever you are ready. Once it is active,
            your dashboard, payments, activity log, and community will be
            waiting for you.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRequestMembership}
              className={PRIMARY_CTA}
            >
              Become a member
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <a
              href={`#${WELCOME_SECTION_IDS.benefits}`}
              className={SECONDARY_CTA}
            >
              Review member benefits
            </a>
          </div>

          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-text-secondary">
            {CTA_POINTS.map((point) => (
              <li key={point} className="inline-flex items-center gap-1.5">
                <Check
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-success"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
