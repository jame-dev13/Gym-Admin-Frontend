import { RefreshBtn } from "@/components/buttons/Buttons";
import { ChartLine } from "@/components/charts/ChartLine";
import { ChartSkeleton } from "@/components/skeleton";
import { useGetInvestmentEvolution } from "@/features/payment/hooks/useFetchPaymentMetrics";
import type { ChartSeries } from "@/types/Types";
import { useMemo } from "react";

const ERROR_MESSAGE = "The investment evolution could not be loaded.";

const SERIES: ChartSeries[] = [
  {
    dataKey: "total",
    name: "Monthly investment",
    color: "#22d3ee",
  },
];

export const PaymentInvestmentEvolution = () => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetInvestmentEvolution();

  const chartData = useMemo(
    () => Array.from(data?.data.content ?? []),
    [data],
  );
  const isBusy = isPending || isRefetching;

  if (isPending) {
    return (
      <ChartSkeleton
        variant="line"
        height={320}
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
        <p>{error.message ?? error.error ?? ERROR_MESSAGE}</p>
        <div className="flex justify-end">
          <RefreshBtn
            label="Retry loading the investment evolution"
            onClick={() => {
              void refetch();
            }}
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
          onClick={() => {
            void refetch();
          }}
        />
      </div>

      <ChartLine
        data={chartData}
        series={SERIES}
        xKey="month"
        tooltipVariant="money"
        locale="es-MX"
        currency="MXN"
        height={320}
        aria-label="Payment investment evolution by month"
      />
    </div>
  );
};
