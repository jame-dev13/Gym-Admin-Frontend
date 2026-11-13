import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * A single label/value pair rendered by the generic section card.
 */
export type SectionCardField = Readonly<{
  key: string;
  label: string;
  value?: ReactNode;
  emptyValue?: string;
}>;

/**
 * Contract fulfilled by every section card.
 *
 * `SectionCard` owns the shell, header, loading, error and empty states while
 * each implementation supplies the domain fields and optional actions.
 */
export interface SectionCardContract {
  title: string;
  description?: string;
  Icon?: LucideIcon;
  fields?: ReadonlyArray<SectionCardField>;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  className?: string;
}

export type SectionCardProps = SectionCardContract;
