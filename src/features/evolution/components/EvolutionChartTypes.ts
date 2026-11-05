import type { LucideIcon } from "lucide-react";
import type {
  ChartDatum,
  ChartSeries,
  ChartTooltipVariant,
} from "@/types/Types";

export type EvolutionStatTone = "accent" | "success" | "danger" | "neutral";

export type EvolutionStat = {
  label: string;
  value: string;
  tone?: EvolutionStatTone;
};

export type EvolutionCardProps = {
  year: number;
};

export type EvolutionChartCardProps = {
  title: string;
  description: string;
  Icon: LucideIcon;
  year: number;
  data: ChartDatum[];
  series: ChartSeries[];
  stats?: ReadonlyArray<EvolutionStat>;
  isLoading?: boolean;
  isRefetching?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  tooltipVariant?: ChartTooltipVariant;
  height?: number;
  onRefetch?: () => void;
  className?: string;
};
