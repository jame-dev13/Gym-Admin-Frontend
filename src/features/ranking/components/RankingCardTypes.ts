import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Contract every concrete ranking card fulfils.
 *
 * `RankingCard` owns the shell (header, refresh action, loading, error and
 * empty states) while each concrete implementation supplies its own items and
 * row renderer.
 */
export interface RankingCardContract<T> {
  title: string;
  description: string;
  Icon?: LucideIcon;
  items: ReadonlyArray<T>;
  getItemKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  /** Optional domain control rendered below the card header, e.g. a filter. */
  headerControls?: ReactNode;
  isLoading?: boolean;
  isRefetching?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  onRefetch?: () => void;
  className?: string;
}

export type RankingCardProps<T> = RankingCardContract<T>;

export type RankingEntryProps = {
  rank: number;
  label: string;
  description?: string;
  value: number;
  valueLabel: string;
};
