import { Search } from "lucide-react";
import {
  useId,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
} from "react";
import { CommandBtn } from "@/components/buttons/Buttons";
import type { SearchInputProps } from "@/types/Props";

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
      className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-1.5 transition-colors duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
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
        className={`w-full flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
      <CommandBtn
        Icon={Icon}
        onClick={handleSearch}
        aria-label={searchLabel}
        disabled={disabled}
        className="shrink-0"
      >
        {""}
      </CommandBtn>
    </div>
  );
};
