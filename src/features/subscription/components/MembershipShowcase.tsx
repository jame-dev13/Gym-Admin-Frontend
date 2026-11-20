import { CommandBtn } from "@/components/buttons/Buttons";
import {
  formatMembershipPlanPrice,
  getMembershipPlans,
  type MembershipPlan,
} from "@/features/subscription/services/membership-plans";
import { Check, Sparkles } from "lucide-react";

export type MembershipShowcaseProps = Readonly<{
  plans?: readonly MembershipPlan[];
  onSelectMembership: (plan: MembershipPlan) => void;
  disabled?: boolean;
  className?: string;
}>;

/**
 * Static catalogue of the memberships a customer can subscribe to.
 *
 * It is fully controlled: the parent owns the selection (typically opening the
 * create dialog bound to the chosen plan), so the same catalogue can be reused
 * outside the subscription overview.
 */
export const MembershipShowcase = ({
  plans = getMembershipPlans(),
  onSelectMembership,
  disabled = false,
  className = "",
}: MembershipShowcaseProps) => {
  return (
    <section
      aria-labelledby="membership-showcase-heading"
      className={["flex flex-col gap-5", className].filter(Boolean).join(" ")}
    >
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles size={14} aria-hidden="true" />
          Memberships
        </span>
        <h2
          id="membership-showcase-heading"
          className="text-2xl font-bold tracking-tight text-text-primary"
        >
          Choose your membership
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          There is no active membership on your account yet. Pick the plan that
          fits your routine to get started.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const { Icon } = plan;

          return (
            <li key={plan.membership} className="h-full">
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 shadow-sm transition-colors duration-200 hover:border-accent/40">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-border bg-surface-over px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
                    {plan.durationLabel}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                    {plan.label}
                  </h3>
                  <p className="flex flex-wrap items-baseline gap-1">
                    <span className="text-2xl font-black tracking-tight text-text-primary">
                      {formatMembershipPlanPrice(plan.price)}
                    </span>
                    <span className="text-xs font-medium text-text-tertiary">
                      MXN
                    </span>
                  </p>
                  <p className="text-xs font-medium text-text-secondary">
                    {plan.cadence}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary">
                  {plan.description}
                </p>

                <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                  {plan.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <Check
                        size={16}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-success"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <CommandBtn
                    Icon={Sparkles}
                    onClick={() => onSelectMembership(plan)}
                    disabled={disabled}
                    aria-label={`Choose the ${plan.label} membership.`}
                    className="w-full"
                  >
                    Choose {plan.label}
                  </CommandBtn>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
