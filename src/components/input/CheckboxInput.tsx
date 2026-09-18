import { useEffect, useId, useRef, type FC } from "react";
import type { CheckboxInputProps } from "@/types/Props";

export const CheckboxInput: FC<CheckboxInputProps> = ({
  label,
  description,
  error,
  indeterminate = false,
  disabled = false,
  id,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...rest
}) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const describedBy = [
    ariaDescribedBy,
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex w-full items-start gap-3">
      <input
        {...rest}
        ref={inputRef}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error) || undefined}
        className={`mt-0.5 size-5 shrink-0 cursor-pointer rounded border-2 accent-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-danger" : "border-border"} ${className}`}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label
          htmlFor={inputId}
          className="cursor-pointer text-sm font-medium text-text-primary"
        >
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-sm text-text-secondary">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} aria-live="polite" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
