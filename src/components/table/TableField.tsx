import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/badge/Badge";
import type { BadgeLeading, BadgeVariant } from "@/components/badge/BadgeTypes";

export type TableFieldIndicator =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "purple"
  | "neutral";

const indicatorClasses: Record<TableFieldIndicator, string> = {
  success: "bg-emerald-500",
  danger: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  purple: "bg-purple-500",
  neutral: "bg-slate-500",
};

export interface TableFieldProps {
  icon: LucideIcon;
  label: string;
  title?: string;
  children: ReactNode;
  badge?: BadgeVariant;
  leading?: BadgeLeading;
  mono?: boolean;
  indicator?: TableFieldIndicator;
}

/**
 * One labelled row inside a table cell: a decorative icon, an accessible
 * label and a value. The value can be plain content, a `Badge` (through the
 * `badge` prop) or a standalone status dot (through `indicator`).
 */
export const TableField = ({
  icon: Icon,
  label,
  title,
  children,
  badge,
  leading,
  mono = false,
  indicator,
}: TableFieldProps) => (
  <div className="flex min-w-0 items-center gap-1.5">
    <Icon size={15} aria-hidden="true" className="shrink-0" />
    <span className="sr-only">{label}</span>
    {indicator && (
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full ${indicatorClasses[indicator]}`}
      />
    )}
    {badge ? (
      <Badge variant={badge} leading={leading} mono={mono} title={title}>
        {children}
      </Badge>
    ) : (
      <span className="min-w-0 truncate" title={title}>
        {children}
      </span>
    )}
  </div>
);

export interface TableFieldGroupProps {
  children: ReactNode;
}

/**
 * Two-row grid used by table cells that show a pair of related fields,
 * matching the AuditLog column layout.
 */
export const TableFieldGroup = ({ children }: TableFieldGroupProps) => (
  <section className="grid min-w-0 grid-rows-2 gap-x-4 gap-y-1.5 text-sm text-text-secondary">
    {children}
  </section>
);
