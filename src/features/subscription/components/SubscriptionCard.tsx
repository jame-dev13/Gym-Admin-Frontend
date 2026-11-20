import { Badge } from "@/components/badge/Badge";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import { CommandBtn } from "@/components/buttons/Buttons";
import { RetryPaymentBtn } from "@/features/payment/components/RetryPaymentBtn";
import {
  formatMembershipLabel,
  formatSubscriptionMetricsMoney,
} from "@/features/subscription/services/subscription-metrics-chart-data";
import { getMembershipPlan } from "@/features/subscription/services/membership-plans";
import type {
  SubscriptionResponse,
  SubscriptionStatus,
} from "@/features/subscription/types";
import {
  CheckCircle2,
  CreditCard,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useId, type ReactNode } from "react";

type StatusPresentation = Readonly<{
  badge: BadgeVariant;
  label: string;
  headline: string;
  description: string;
  root: string;
  accentBar: string;
}>;

const STATUS_PRESENTATION: Record<SubscriptionStatus, StatusPresentation> = {
  FINALIZED: {
    badge: "slate",
    label: "Finalized",
    headline: "This membership has ended",
    description:
      "Renew it to keep training, or delete it from your account if you no longer need it.",
    root: "border-slate-500/40",
    accentBar: "bg-slate-500",
  },
  NOT_PAID: {
    badge: "rose",
    label: "Not paid",
    headline: "Your payment is pending",
    description:
      "Retry the payment to activate this membership and start training.",
    root: "border-danger/40",
    accentBar: "bg-danger",
  },
  PAID: {
    badge: "emerald",
    label: "Paid",
    headline: "Your membership is active",
    description:
      "Everything is up to date. Finalize the membership whenever you decide to stop.",
    root: "border-success/40",
    accentBar: "bg-success",
  },
  DROPPED: {
    badge: "slate",
    label: "Dropped",
    headline: "This membership was dropped",
    description:
      "The subscription is no longer active and has no available actions.",
    root: "border-border",
    accentBar: "bg-border-emphasis",
  },
  ON_RENEWAL: {
    badge: "amber",
    label: "On renewal",
    headline: "Your membership is waiting for the renewal payment",
    description:
      "Retry the payment to keep the membership active for the next period.",
    root: "border-warning/40",
    accentBar: "bg-warning",
  },
  RENEWED: {
    badge: "blue",
    label: "Renewed",
    headline: "Your membership has been renewed",
    description:
      "The new period is already paid. Finalize the membership once you are done with it.",
    root: "border-popover-blue/40",
    accentBar: "bg-popover-blue",
  },
};

export type SubscriptionCardProps = Readonly<{
  subscription: SubscriptionResponse;
  onRenew: (subscription: SubscriptionResponse) => void;
  onFinalize: (subscription: SubscriptionResponse) => void;
  onDelete: (subscription: SubscriptionResponse) => void;
  className?: string;
}>;

/**
 * Current subscription card.
 *
 * Fully controlled: it only renders the received subscription and delegates
 * every action to the callbacks owned by `SubscriptionOverviewLayout`.
 */
export const SubscriptionCard = ({
  subscription,
  onRenew,
  onFinalize,
  onDelete,
  className = "",
}: SubscriptionCardProps) => {
  const titleId = useId();
  const presentation = STATUS_PRESENTATION[subscription.status];
  const plan = getMembershipPlan(subscription.membership);
  const planLabel = plan?.label ?? formatMembershipLabel(subscription.membership);
  const canRetry =
    subscription.status === "NOT_PAID" ||
    subscription.status === "ON_RENEWAL";

  const controls: ReactNode[] = [];

  if (subscription.status === "FINALIZED") {
    controls.push(
      <CommandBtn
        key="renew"
        Icon={RotateCcw}
        onClick={() => onRenew(subscription)}
        aria-label="Renew current subscription."
        className="w-full sm:w-auto"
      >
        Renew
      </CommandBtn>,
      <CommandBtn
        key="delete"
        Icon={Trash2}
        onClick={() => onDelete(subscription)}
        aria-label="Delete current subscription."
        className="w-full border-danger/60 text-danger hover:border-danger hover:bg-danger/10 sm:w-auto"
      >
        Delete
      </CommandBtn>,
    );
  }

  if (canRetry) {
    controls.push(
      <div key="retry" className="w-full sm:w-40">
        <RetryPaymentBtn />
      </div>,
    );
  }

  if (
    subscription.status === "PAID" ||
    subscription.status === "RENEWED"
  ) {
    controls.push(
      <CommandBtn
        key="finalize"
        Icon={CheckCircle2}
        onClick={() => onFinalize(subscription)}
        aria-label="Finalize current subscription."
        className="w-full sm:w-auto"
      >
        Finalize
      </CommandBtn>,
    );
  }

  return (
    <section
      aria-labelledby={titleId}
      className={[
        "overflow-hidden rounded-2xl border bg-surface-raised shadow-sm",
        presentation.root,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className={`h-1 w-full ${presentation.accentBar}`}
      />

      <header className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
            <CreditCard size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              Current subscription
            </p>
            <h2
              id={titleId}
              className="truncate text-2xl font-bold tracking-tight text-text-primary"
            >
              {planLabel}
            </h2>
            <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
              {presentation.headline}
            </p>
          </div>
        </div>

        <Badge variant={presentation.badge} leading="dot">
          {presentation.label}
        </Badge>
      </header>

      <div className="flex flex-col gap-4 px-5 py-5">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-3xl font-black tracking-tight text-text-primary">
            {formatSubscriptionMetricsMoney(subscription.price)}
          </span>
          <span className="text-sm font-medium text-text-tertiary">MXN</span>
        </p>

        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          {presentation.description}
        </p>

        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-surface-over/30 px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              Customer
            </dt>
            <dd className="mt-1 min-w-0 truncate text-sm font-medium text-text-primary">
              {subscription.customerEmail}
            </dd>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface-over/30 px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              Membership
            </dt>
            <dd className="mt-1 truncate text-sm font-medium text-text-primary">
              {planLabel}
            </dd>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface-over/30 px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              Billing
            </dt>
            <dd className="mt-1 truncate text-sm font-medium text-text-primary">
              {plan?.cadence ?? "Not available"}
            </dd>
          </div>
        </dl>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
          Available actions
        </p>
        {controls.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {controls}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            No actions available for this status.
          </p>
        )}
      </footer>
    </section>
  );
};
