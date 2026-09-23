import { useId, type FC } from "react";
import type { SelectProps } from "@/types/Props";

export const Select: FC<SelectProps> = ({
  options,
  label,
  name,
  id,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  description,
  error,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}) => {
  const autoId = useId();
  const selectId = id ?? autoId;
  const descriptionId = `${selectId}-description`;
  const errorId = `${selectId}-error`;
  const isEmpty = options.length === 0;

  const describedBy = [ariaDescribedBy, description ? descriptionId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  // Uncontrolled selects start on the placeholder (value "") unless the
  // consumer provides a defaultValue. A disabled placeholder option alone
  // is skipped by native initial-selection behavior.
  const resolvedDefaultValue =
    value === undefined ? (defaultValue ?? "") : undefined;

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      {description && (
        <p id={descriptionId} className="text-sm text-text-secondary">
          {description}
        </p>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        defaultValue={resolvedDefaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled || isEmpty}
        aria-label={ariaLabel ?? label}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error) || undefined}
        className={`block w-full cursor-pointer bg-transparent border-0 border-b-2 py-2.5 px-0 text-left tracking-wide focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-accent"
        }`}
      >
        {!isEmpty && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {isEmpty && (
          <option value="" disabled>
            No options available
          </option>
        )}
      </select>
      {error && (
        <p id={errorId} aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};
