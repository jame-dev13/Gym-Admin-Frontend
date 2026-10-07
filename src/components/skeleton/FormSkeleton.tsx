import type { FC } from "react";
import "./Skeleton.css";

export interface FormSkeletonProps {
  fields?: number;
  showLegend?: boolean;
  showSubmit?: boolean;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_FIELDS = 5;

export const FormSkeleton: FC<FormSkeletonProps> = ({
  fields = DEFAULT_FIELDS,
  showLegend = true,
  showSubmit = true,
  "aria-label": ariaLabel = "Form loading skeleton",
  className = "",
}) => {
  return (
    <form
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
      className={`flex w-full flex-col gap-4 ${className}`}
    >
      {showLegend && (
        <fieldset className="border border-border rounded-xl p-4 bg-surface-raised">
          <legend className="skeleton-pulse skeleton-text skeleton-text-lg w-1/4 px-2 mb-4" aria-hidden="true" />
          <div className="space-y-4">
            {[...Array(fields)].map((_, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <label className="skeleton-pulse skeleton-text skeleton-text-sm w-1/4" aria-hidden="true" />
                <div className="skeleton-pulse skeleton-input w-full max-w-md" aria-hidden="true" />
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {!showLegend && (
        <div className="space-y-4">
          {[...Array(fields)].map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <label className="skeleton-pulse skeleton-text skeleton-text-sm w-1/4" aria-hidden="true" />
              <div className="skeleton-pulse skeleton-input w-full max-w-md" aria-hidden="true" />
            </div>
          ))}
        </div>
      )}

      {showSubmit && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <div className="skeleton-pulse skeleton-button w-24 h-10" aria-hidden="true" />
          <div className="skeleton-pulse skeleton-button bg-transparent border border-border w-24 h-10" aria-hidden="true" />
        </div>
      )}
    </form>
  );
};