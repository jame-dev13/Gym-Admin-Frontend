import { CommandBtn } from "@/components/buttons/Buttons";
import { useModalContext } from "@/context/useModalContext";
import {
  CreateCurrentSubscriptionDialog,
  DeleteCurrentSubscriptionDialog,
  FinalizeCurrentSubscriptionDialog,
  RenewCurrentSubscriptionDialog,
} from "@/features/subscription/components/CurrentSubscriptionConfirmDialog";
import { MembershipShowcase } from "@/features/subscription/components/MembershipShowcase";
import { SubscriptionCard } from "@/features/subscription/components/SubscriptionCard";
import { SubscriptionPeriodMetrics } from "@/features/subscription/components/SubscriptionPeriodMetrics";
import { useGetSubscription } from "@/features/subscription/hooks/useFetchCurrentSubscription";
import type { MembershipPlan } from "@/features/subscription/services/membership-plans";
import type { SubscriptionResponse } from "@/features/subscription/types";
import { HttpStatusCode } from "axios";
import { CreditCard, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

const MISSING_SUBSCRIPTION_CODE = "NOT_FOUND_OPERATION";
const ERROR_MESSAGE = "Your current subscription could not be loaded.";

const SubscriptionOverviewFallback = () => (
  <div
    role="status"
    aria-label="Loading current subscription"
    aria-busy="true"
    className="flex flex-col gap-6"
  >
    <div
      aria-hidden="true"
      className="h-56 animate-pulse rounded-2xl border border-border bg-surface-raised"
    />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-24 animate-pulse rounded-2xl border border-border bg-surface-raised"
        />
      ))}
    </div>
  </div>
);

/**
 * Customer-facing subscription overview.
 *
 * Decides between the "welcome" membership showcase and the current
 * subscription card from the payload of the current-subscription endpoint.
 * The modal host lives in `HomeLayout`.
 */
export const SubscriptionOverviewLayout = () => {
  const { data, error, isPending, refetch } = useGetSubscription();
  const { openModal } = useModalContext();

  const subscription = data?.data;
  const isMissingSubscription =
    error?.code === MISSING_SUBSCRIPTION_CODE &&
    error?.status === HttpStatusCode.NotFound;
  const errorMessage =
    error && !isMissingSubscription
      ? (error.message ?? error.error ?? ERROR_MESSAGE)
      : null;

  const handleSelectMembership = (plan: MembershipPlan) => {
    openModal({
      title: "Start a membership",
      description: `Create a new ${plan.label} membership.`,
      size: "sm",
      data: plan,
      render: (selected) => (
        <CreateCurrentSubscriptionDialog membership={selected.membership} />
      ),
    });
  };

  const handleRenew = (current: SubscriptionResponse) => {
    openModal({
      title: "Renew membership",
      description: `Renew the ${current.membership.toLowerCase()} membership.`,
      size: "sm",
      data: current,
      render: (selected) => (
        <RenewCurrentSubscriptionDialog membership={selected.membership} />
      ),
    });
  };

  const handleFinalize = (current: SubscriptionResponse) => {
    openModal({
      title: "Finalize membership",
      description: `Finalize the ${current.membership.toLowerCase()} membership.`,
      size: "sm",
      data: current,
      render: () => <FinalizeCurrentSubscriptionDialog />,
    });
  };

  const handleDelete = (current: SubscriptionResponse) => {
    openModal({
      title: "Delete membership",
      description: `Delete the ${current.membership.toLowerCase()} membership.`,
      size: "sm",
      data: current,
      render: () => <DeleteCurrentSubscriptionDialog />,
    });
  };

  let content: ReactNode;

  if (isPending) {
    content = <SubscriptionOverviewFallback />;
  } else if (subscription) {
    content = (
      <div className="flex flex-col gap-6">
        <SubscriptionCard
          subscription={subscription}
          onRenew={handleRenew}
          onFinalize={handleFinalize}
          onDelete={handleDelete}
        />
        <SubscriptionPeriodMetrics subscription={subscription} />
      </div>
    );
  } else if (isMissingSubscription) {
    content = (
      <MembershipShowcase onSelectMembership={handleSelectMembership} />
    );
  } else if (errorMessage) {
    content = (
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-2xl border border-danger/30 bg-danger/10 p-5"
      >
        <p className="text-sm text-danger">{errorMessage}</p>
        <div className="flex justify-end">
          <CommandBtn
            Icon={RefreshCw}
            onClick={() => void refetch()}
            aria-label="Retry loading current subscription."
          >
            Try again
          </CommandBtn>
        </div>
      </div>
    );
  } else {
    content = (
      <p
        role="status"
        className="rounded-2xl border border-border bg-surface-raised px-5 py-8 text-center text-sm text-text-secondary"
      >
        No subscription information available.
      </p>
    );
  }

  return (
    <section
      aria-labelledby="subscription-overview-heading"
      className="flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
    >
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <CreditCard size={14} aria-hidden="true" />
          Membership
        </span>
        <h1
          id="subscription-overview-heading"
          className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          Subscription overview
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Review your current membership, follow its payment status, and manage
          the actions available for it.
        </p>
      </header>

      <div className="min-h-0 pb-4">{content}</div>
    </section>
  );
};

export default SubscriptionOverviewLayout;
