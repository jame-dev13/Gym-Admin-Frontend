import { ArrowRight, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export type SubscriptionCallToActionProps = Readonly<{
  to?: string;
  className?: string;
}>;

/**
 * Empty state for the subscription overview.
 *
 * It only redirects the customer to the home overview, where the membership
 * showcase is rendered to start a new subscription.
 */
export const SubscriptionCallToAction = ({
  to = "/home",
  className = "",
}: SubscriptionCallToActionProps) => {
  return (
    <section
      aria-labelledby="subscription-call-to-action-heading"
      className={[
        "relative overflow-hidden rounded-2xl border border-accent/30 bg-surface-raised p-6 shadow-sm sm:p-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <CreditCard size={14} aria-hidden="true" />
          Membership
        </span>

        <div className="flex flex-col gap-2">
          <h2
            id="subscription-call-to-action-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            You do not have a membership yet
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            There is no active subscription on your account. Head to your Home
            overview to explore the available membership plans and choose the
            one that fits your routine.
          </p>
        </div>

        <div>
          <Link
            to={to}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition-colors duration-200 hover:bg-accent-emphasis"
          >
            Explore memberships
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionCallToAction;
