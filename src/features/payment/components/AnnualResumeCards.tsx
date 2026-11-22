import { RefreshBtn } from "@/components/buttons/Buttons";
import { ResumeCard } from "@/components/card/ResumeCard";
import type { AnnualResumeResponse } from "@/features/payment/types";
import type { ApiErrorResponse } from "@/types/Types";
import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  Store,
} from "lucide-react";

const DEFAULT_ERROR_MESSAGE = "The annual payment summary could not be loaded.";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

const countFormatter = new Intl.NumberFormat("en-US");

type ResumeMetric = {
  key: keyof AnnualResumeResponse;
  label: string;
  footerText: string;
  Icon: LucideIcon;
  value: number;
  format: (value: number) => string;
};

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatCount = (value: number) => countFormatter.format(value);

const buildMetrics = (resume: AnnualResumeResponse): ResumeMetric[] => [
  {
    key: "totalPaymentsMade",
    label: "Payments made",
    footerText: "Total transactions",
    Icon: ReceiptText,
    value: resume.totalPaymentsMade,
    format: formatCount,
  },
  {
    key: "totalExpend",
    label: "Total spend",
    footerText: "Accumulated amount",
    Icon: CircleDollarSign,
    value: resume.totalExpend,
    format: formatCurrency,
  },
  {
    key: "average",
    label: "Average payment",
    footerText: "Per transaction",
    Icon: ChartNoAxesCombined,
    value: resume.average,
    format: formatCurrency,
  },
  {
    key: "electronicPaymentsDone",
    label: "Electronic",
    footerText: "Digital payments",
    Icon: CreditCard,
    value: resume.electronicPaymentsDone,
    format: formatCount,
  },
  {
    key: "physicPaymentsDone",
    label: "Physical",
    footerText: "In-person payments",
    Icon: Store,
    value: resume.physicPaymentsDone,
    format: formatCount,
  },
];

const ResumeCardsSkeleton = () => (
  <div
    role="status"
    aria-label="Loading annual payment summary"
    aria-busy="true"
    className="grid gap-4 sm:grid-cols-2 tab:grid-cols-3 2xl:grid-cols-5"
  >
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="h-40 animate-pulse rounded-2xl border border-border bg-surface-raised"
      />
    ))}
  </div>
);

export type AnnualResumeCardsProps = {
  resume?: AnnualResumeResponse;
  error?: ApiErrorResponse | null;
  isPending: boolean;
  isRefetching: boolean;
  onRefetch: () => void;
  errorMessage?: string;
};

export const AnnualResumeCards = ({
  resume,
  error,
  isPending,
  isRefetching,
  onRefetch,
  errorMessage = DEFAULT_ERROR_MESSAGE,
}: AnnualResumeCardsProps) => {
  const metrics = resume ? buildMetrics(resume) : [];
  const isBusy = isPending || isRefetching;

  if (isPending) {
    return <ResumeCardsSkeleton />;
  }

  if (error && !resume) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm text-danger"
      >
        <p>{error.message ?? error.error ?? errorMessage}</p>
        <div className="flex justify-end">
          <RefreshBtn
            label="Retry loading the annual payment summary"
            onClick={onRefetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          {isRefetching ? "Refreshing metrics…" : "Current year"}
        </p>
        <RefreshBtn
          label="Refresh annual payment summary"
          disabled={isBusy}
          onClick={onRefetch}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 tab:grid-cols-3 2xl:grid-cols-5">
        {metrics.map(({ key, label, footerText, Icon, value, format }) => (
          <ResumeCard
            key={key}
            Icon={Icon}
            heading={label}
            footerText={footerText}
          >
            <p className="text-2xl font-black tracking-tight text-text-primary">
              {format(value)}
            </p>
          </ResumeCard>
        ))}
      </div>
    </div>
  );
};
