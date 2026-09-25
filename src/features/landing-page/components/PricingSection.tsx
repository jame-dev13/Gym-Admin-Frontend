import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/features/landing-page/components/Reveal";
import {
  formatMembershipPrice,
  getMembershipsConfig,
} from "@/features/landing-page/services/MembershipsConfig";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";
import type { Membership } from "@/features/landing-page/types/LandingTypes";

const MembershipCard = ({ membership, index }: { membership: Membership; index: number }) => (
  <Reveal delay={Math.min(index * 80, 320)} className="h-full">
      <article
      aria-label={`${membership.name} membership`}
      className={`relative flex h-full flex-col gap-5 rounded-2xl border p-6 transition-transform duration-300 ${
        membership.featured
          ? "border-accent bg-surface-raised shadow-[0_0_40px_rgba(34,211,238,0.15)] sm:scale-105"
          : "border-border bg-surface-raised/60 hover:border-border-emphasis"
      }`}
    >
      {membership.featured && (
        <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold whitespace-nowrap text-surface uppercase">
          Most popular
        </p>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">{membership.name}</h3>
        <p className="text-sm text-text-secondary">{membership.tagline}</p>
      </div>
      <p className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight">
          {formatMembershipPrice(membership)}
        </span>
        <span className="text-sm text-text-secondary">{membership.periodLabel}</span>
      </p>
      <ul className="flex flex-col gap-2.5 text-sm">
        {membership.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5">
            <Check
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />
            <span className="text-text-secondary">{perk}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/auth/register"
        aria-label={`Choose the ${membership.name} membership`}
        className={`mt-auto inline-flex items-center justify-center rounded-full px-6 py-2.5 font-semibold transition ${
          membership.featured
            ? "bg-accent text-surface hover:bg-accent-emphasis"
            : "border border-border-emphasis text-text-primary hover:border-accent hover:text-accent"
        }`}
      >
        Choose {membership.name}
      </Link>
    </article>
  </Reveal>
);

export const PricingSection = () => {
  const memberships = getMembershipsConfig();
  return (
    <section
      id={LANDING_SECTION_IDS.pricing}
      aria-labelledby="pricing-title"
      className="scroll-mt-20 border-t border-border"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:py-20">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Memberships
          </p>
          <h2 id="pricing-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            A plan for every pace
          </h2>
          <p className="text-lg text-text-secondary">
            Clear pricing in Mexican pesos, no sign-up fees or fine print.
            Cancel anytime.
          </p>
        </Reveal>
        <div className="grid items-stretch gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {memberships.map((membership, index) => (
            <MembershipCard key={membership.id} membership={membership} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
