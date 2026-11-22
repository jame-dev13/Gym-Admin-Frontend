import { Badge } from "@/components/badge/Badge";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useGetLastCurrentPayment } from "@/features/payment/hooks/useFetchPayments";
import {
  formatPaymentAmount,
  formatPaymentDate,
  formatPaymentMethod,
  formatPaymentStatus,
} from "@/features/payment/services/payment-format";
import {
  CalendarClock,
  CreditCard,
  RefreshCw,
  Store,
  Wallet,
} from "lucide-react";

const ERROR_MESSAGE = "Your latest payment could not be loaded.";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  PENDING: "amber",
  COMPLETED: "emerald",
  FAILED: "rose",
  REFUNDED: "blue",
  FINALIZED: "slate",
};

const LastPaymentFallback = () => (
  <div
    role="status"
    aria-label="Loading last payment"
    aria-busy="true"
    className="h-28 animate-pulse rounded-2xl border border-border bg-surface-raised"
  />
);

/**
 * Most recent payment registered for the current customer.
 *
 * The home overview relies on the dedicated last-payment endpoint, so it stays
 * in sync with the payments table rendered below it.
 */
export const LastPaymentSection = () => {
  const { data, error, isPending, refetch } = useGetLastCurrentPayment();

  const payment = data?.data;
  const errorMessage =
    error && !payment ? (error.message ?? error.error ?? ERROR_MESSAGE) : null;

  if (isPending) {
    return <LastPaymentFallback />;
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
            onClick={async () => await refetch()}
            aria-label="Retry loading the last payment."
          >
            Try again
          </CommandBtn>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-border bg-surface-raised px-5 py-8 text-center text-sm text-text-secondary"
      >
        No payments have been registered on your account yet.
      </p>
    );
  }

  const MethodIcon = payment.paymentMethod === "PHYSIC" ? Store : CreditCard;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
          <Wallet size={22} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-2xl font-black tracking-tight text-text-primary">
            {formatPaymentAmount(payment.amount)}
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <MethodIcon size={14} aria-hidden="true" />
              {formatPaymentMethod(payment.paymentMethod)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={14} aria-hidden="true" />
              <time dateTime={payment.createdAt}>
                {formatPaymentDate(payment.createdAt)}
              </time>
            </span>
          </p>
        </div>
      </div>

      <Badge
        variant={STATUS_VARIANT[payment.status] ?? "slate"}
        leading="dot"
        className="self-start sm:self-auto"
      >
        {formatPaymentStatus(payment.status)}
      </Badge>
    </article>
  );
};

export default LastPaymentSection;
