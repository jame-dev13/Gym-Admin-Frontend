import { CommandBtn } from "@/components/buttons/Buttons";
import { SubscriptionCard } from "@/features/subscription/components/SubscriptionCard";
import { useCurrentSubscriptionDialogs } from "@/features/subscription/hooks/useCurrentSubscriptionDialogs";
import { useGetSubscription } from "@/features/subscription/hooks/useFetchCurrentSubscription";
import { RefreshCw } from "lucide-react";

const ERROR_MESSAGE = "Your current subscription could not be loaded.";

const CurrentSubscriptionFallback = () => (
  <div
    role="status"
    aria-label="Loading current subscription"
    aria-busy="true"
    className="h-64 animate-pulse rounded-2xl border border-border bg-surface-raised"
  />
);

/**
 * Home overview section that renders the current subscription card and owns
 * the dialogs for the actions exposed by each subscription status.
 */
export const CurrentSubscriptionSection = () => {
  const { data, error, isPending, refetch } = useGetSubscription();
  const {
    openRenewDialog,
    openFinalizeDialog,
    openDeleteDialog,
  } = useCurrentSubscriptionDialogs();

  const subscription = data?.data;
  const errorMessage =
    error && !subscription
      ? (error.message ?? error.error ?? ERROR_MESSAGE)
      : null;

  if (isPending) {
    return <CurrentSubscriptionFallback />;
  }

  if (errorMessage) {
    return (
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
  }

  if (!subscription) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-border bg-surface-raised px-5 py-8 text-center text-sm text-text-secondary"
      >
        No subscription information available.
      </p>
    );
  }

  return (
    <SubscriptionCard
      subscription={subscription}
      onRenew={openRenewDialog}
      onFinalize={openFinalizeDialog}
      onDelete={openDeleteDialog}
    />
  );
};

export default CurrentSubscriptionSection;
