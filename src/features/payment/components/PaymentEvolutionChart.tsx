import { RefreshBtn } from "@/components/buttons/Buttons";
import { ChartLine } from "@/components/charts/ChartLine";
import { ChartSkeleton } from "@/components/skeleton";
import type { BillingMonth } from "@/features/evolution/types";
import type { ApiErrorResponse, ChartSeries } from "@/types/Types";
import { useMemo } from "react";

const DEFAULT_ERROR_MESSAGE = "The investment evolution could not be loaded.";

const DEFAULT_SERIES: ChartSeries[] = [
  {
    dataKey: "total",
    name: "Monthly investment",
    color: "#22d3ee",
  },
];

export type PaymentEvolutionChartProps = {
  months: ReadonlyArray<BillingMonth>;
  isPending: boolean;
  isRefetching: boolean;
  onRefetch: () => void;
  error?: ApiErrorResponse | null;
  errorMessage?: string;
  series?: ChartSeries[];
  height?: number;
  ariaLabel?: string;
};

export const PaymentEvolutionChart = ({
  months,
  isPending,
  isRefetching,
  onRefetch,
  error,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  series = DEFAULT_SERIES,
  height = 320,
  ariaLabel = "Payment investment evolution by month",
}: PaymentEvolutionChartProps) => {
  const chartData = useMemo(() => Array.from(months), [months]);
  const isBusy = isPending || isRefetching;

  if (isPending) {
    return (
      <ChartSkeleton
        variant="line"
        height={height}
        showLegend={false}
        aria-label="Loading payment investment evolution"
      />
    );
  }

  if (error && chartData.length === 0) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm text-danger"
      >
        <p>{error.message ?? error.error ?? errorMessage}</p>
        <div className="flex justify-end">
          <RefreshBtn
            label="Retry loading the investment evolution"
            onClick={onRefetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          {isRefetching ? "Refreshing evolution…" : "Monthly totals"}
        </p>
        <RefreshBtn
          label="Refresh investment evolution"
          disabled={isBusy}
          onClick={onRefetch}
        />
      </div>

      <ChartLine
        data={chartData}
        series={series}
        xKey="month"
        tooltipVariant="money"
        locale="es-MX"
        currency="MXN"
        height={height}
        aria-label={ariaLabel}
      />
    </div>
  );
};
