import { useId } from "react";
import type { SectionCardProps } from "@/features/current/components/SectionCardTypes";

type SectionCardSkeletonProps = {
  label: string;
};

const SectionCardSkeleton = ({ label }: SectionCardSkeletonProps) => (
  <div role="status" aria-label={label} aria-busy="true" className="space-y-3">
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="animate-pulse space-y-2 rounded-xl border border-border/60 bg-surface-over/30 px-4 py-3"
      >
        <div className="h-2.5 w-24 rounded bg-surface-over" />
        <div className="h-3.5 w-2/3 rounded bg-surface-over" />
      </div>
    ))}
  </div>
);

/**
 * Generic section card shell.
 *
 * Concrete cards provide their domain data through `fields` and can add
 * actions or custom content without duplicating the card layout.
 */
export const SectionCard = ({
  title,
  description,
  Icon,
  fields = [],
  actions,
  footer,
  children,
  isLoading = false,
  errorMessage = null,
  emptyMessage = "No information available.",
  className = "",
}: SectionCardProps) => {
  const titleId = useId();
  const hasFields = fields.length > 0;
  const hasContent = hasFields || Boolean(children);

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isLoading || undefined}
      className={[
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                <Icon size={20} aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <h2
                id={titleId}
                className="truncate text-lg font-semibold tracking-tight text-text-primary"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
                  {description}
                </p>
              )}
            </div>
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-5">
        {errorMessage ? (
          <p
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-8 text-center text-sm text-danger"
          >
            {errorMessage}
          </p>
        ) : isLoading && !hasContent ? (
          <SectionCardSkeleton label={`Loading ${title.toLowerCase()}`} />
        ) : hasFields ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className="rounded-xl border border-border/70 bg-surface-over/30 px-4 py-3"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                  {field.label}
                </dt>
                <dd className="mt-1 min-w-0 break-words text-sm font-medium text-text-primary">
                  {field.value ?? field.emptyValue ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        ) : children ? (
          children
        ) : (
          <p
            role="status"
            className="px-4 py-8 text-center text-sm text-text-secondary"
          >
            {emptyMessage}
          </p>
        )}
      </div>

      {footer && (
        <footer className="border-t border-border px-4 py-3 sm:px-5">
          {footer}
        </footer>
      )}
    </section>
  );
};

export default SectionCard;
