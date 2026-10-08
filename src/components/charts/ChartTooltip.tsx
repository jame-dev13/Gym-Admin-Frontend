import type { FC } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type {
  ChartTooltipEntry,
  ChartTooltipProps,
} from "./ChartTypes";
import type { ChartDatum } from "@/types/Types";

const DEFAULT_LOCALE = "es-MX";
const DEFAULT_CURRENCY = "MXN";

const toNumber = (value: string | number | undefined): number | null => {
  if (value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatMoney = (
  value: string | number | undefined,
  locale: string,
  currency: string,
): string => {
  const amount = toNumber(value) ?? 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

const findPreviousValue = (
  data: ChartDatum[] | undefined,
  xKey: string | undefined,
  label: string | number | undefined,
  dataKey: string | number | undefined,
): number | null => {
  if (!data || !xKey || label === undefined || dataKey === undefined) {
    return null;
  }
  const index = data.findIndex((datum) => datum[xKey] === label);
  if (index <= 0) {
    return null;
  }
  return toNumber(data[index - 1][String(dataKey)]);
};

const RateDelta: FC<{
  current: number | null;
  previous: number | null;
}> = ({ current, previous }) => {
  if (current === null || previous === null || previous === 0) {
    return <span className="text-text-tertiary">—</span>;
  }
  const change = ((current - previous) / Math.abs(previous)) * 100;
  if (change === 0) {
    return <span className="text-text-tertiary">—</span>;
  }
  const formatted = `${change > 0 ? "+" : "-"}${Math.abs(change).toFixed(1)}%`;
  return change > 0 ? (
    <span className="text-success inline-flex items-center gap-1 font-semibold">
      <ArrowUp size={14} aria-hidden="true" className="shrink-0" />
      {formatted}
    </span>
  ) : (
    <span className="text-danger inline-flex items-center gap-1 font-semibold">
      <ArrowDown size={14} aria-hidden="true" className="shrink-0" />
      {formatted}
    </span>
  );
};

const renderValue = (
  variant: ChartTooltipProps["variant"],
  entry: ChartTooltipEntry,
  locale: string,
  currency: string,
  previous: number | null,
) => {
  if (variant === "money") {
    return (
      <span className="font-semibold text-text-primary">
        {formatMoney(entry.value, locale, currency)}
      </span>
    );
  }
  if (variant === "rate") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="font-semibold text-text-primary">
          {entry.value ?? "—"}
        </span>
        <RateDelta current={toNumber(entry.value)} previous={previous} />
      </span>
    );
  }
  return (
    <span className="font-semibold text-text-primary">
      {entry.value ?? "—"}
    </span>
  );
};

export const ChartTooltip: FC<ChartTooltipProps> = ({
  variant = "default",
  active,
  label,
  payload,
  data,
  xKey,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 shadow-lg">
      {label !== undefined && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {label}
        </p>
      )}
      <ul className="flex flex-col gap-1">
        {payload.map((entry, index) => (
          <li
            key={entry.dataKey ?? entry.name ?? index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="inline-flex items-center gap-2 text-text-secondary">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color ?? "#22d3ee" }}
              />
              {entry.name}
            </span>
            {renderValue(
              variant,
              entry,
              locale,
              currency,
              findPreviousValue(data, xKey, label, entry.dataKey),
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
