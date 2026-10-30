import type { RankingEntryProps } from "./RankingCardTypes";

const rankStyles = (rank: number): string => {
  switch (rank) {
    case 1:
      return "border-warning/40 bg-warning/15 text-warning";
    case 2:
      return "border-slate-400/40 bg-slate-400/10 text-slate-300";
    case 3:
      return "border-orange-500/40 bg-orange-500/10 text-orange-400";
    default:
      return "border-border bg-surface-over text-text-secondary";
  }
};

export const RankingEntry = ({
  rank,
  label,
  description,
  value,
  valueLabel,
}: RankingEntryProps) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-label={`Rank ${rank}`}
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums ${rankStyles(rank)}`}
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <p
          title={label}
          className="truncate text-sm font-semibold text-text-primary"
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-text-tertiary">
            {description}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-lg font-semibold leading-tight text-text-primary tabular-nums">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-text-tertiary">{valueLabel}</p>
      </div>
    </div>
  );
};
