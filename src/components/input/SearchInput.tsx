import { Search } from "lucide-react";
import {
  useId,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
} from "react";
import type { SearchInputProps } from "./InputTypes";

export const SearchInput: FC<SearchInputProps> = ({
  labelText = "Search",
  Icon = Search,
  placeholder = "Search...",
  autoComplete = "off",
  disabled = false,
  readOnly = false,
  searchLabel = "Search",
  value: externalValue,
  defaultValue = "",
  onChange,
  onKeyDown,
  onSearch,
  id,
  className = "",
  ...rest
}) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [internalValue, setInternalValue] = useState(() =>
    String(defaultValue ?? ""),
  );
  const currentValue = String(externalValue ?? internalValue ?? "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (externalValue === undefined) {
      setInternalValue(e.currentTarget.value);
    }
    onChange?.(e);
  };

  const handleSearch = () => {
    if (disabled || readOnly) return;
    onSearch?.(currentValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
    onKeyDown?.(e);
  };

  return (
    <div
      role="search"
      className="group flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-surface-raised pl-3 pr-1.5 transition-colors duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
    >
      <label htmlFor={inputId} className="sr-only">
        {labelText}
      </label>
      <input
        {...rest}
        id={inputId}
        type="search"
        role="searchbox"
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`h-full w-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
      <button
        type="button"
        onClick={handleSearch}
        aria-label={searchLabel}
        disabled={disabled}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon size={16} aria-hidden="true" />
      </button>
    </div>
  );
};
