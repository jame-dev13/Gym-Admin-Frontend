import { useCallback, useMemo, useState } from "react";
import type { SortDirection, SortOption } from "@/types/Types";

export interface UseSortControlsArgs<T extends string> {
  options: ReadonlyArray<SortOption<T>>;
  initialSortBy?: T;
  initialDirection?: SortDirection;
  onChange?: (next: { sortBy: T; direction: SortDirection }) => void;
}

export interface UseSortControlsResult<T extends string> {
  sortBy: T;
  direction: SortDirection;
  setSortBy: (value: T) => void;
  toggleDirection: () => void;
  reset: () => void;
  queryParams: { sortBy: T; direction: SortDirection };
  sortDropdownProps: {
    options: ReadonlyArray<SortOption<T>>;
    value: T;
    onChange: (value: T) => void;
  };
  directionToggleProps: {
    direction: SortDirection;
    onToggle: () => void;
  };
}

function firstEnabledValue<T extends string>(
  options: ReadonlyArray<SortOption<T>>,
): T {
  const found = options.find((option) => !option.disabled);
  if (!found) {
    throw new Error("useSortControls requires at least one enabled option");
  }
  return found.value;
}

function assertKnownValue<T extends string>(
  options: ReadonlyArray<SortOption<T>>,
  value: T,
): void {
  const known = options.some((option) => option.value === value);
  if (!known) {
    throw new Error(`useSortControls received unknown sort value "${value}"`);
  }
}

export function useSortControls<T extends string>({
  options,
  initialSortBy,
  initialDirection = "asc",
  onChange,
}: UseSortControlsArgs<T>): UseSortControlsResult<T> {
  if (options.length === 0) {
    throw new Error("useSortControls requires at least one sort option");
  }

  const fallback = firstEnabledValue(options);
  if (initialSortBy !== undefined) {
    assertKnownValue(options, initialSortBy);
  }
  const resolvedInitial = initialSortBy ?? fallback;

  const [sortBy, setSortByState] = useState<T>(resolvedInitial);
  const [direction, setDirectionState] = useState<SortDirection>(initialDirection);

  const setSortBy = useCallback(
    (value: T) => {
      assertKnownValue(options, value);
      setSortByState(value);
      onChange?.({ sortBy: value, direction });
    },
    [options, onChange, direction],
  );

  const toggleDirection = useCallback(() => {
    setDirectionState((current) => {
      const next: SortDirection = current === "asc" ? "desc" : "asc";
      onChange?.({ sortBy, direction: next });
      return next;
    });
  }, [onChange, sortBy]);

  const reset = useCallback(() => {
    setSortByState(resolvedInitial);
    setDirectionState(initialDirection);
    onChange?.({ sortBy: resolvedInitial, direction: initialDirection });
  }, [resolvedInitial, initialDirection, onChange]);

  const queryParams = useMemo(
    () => ({ sortBy, direction }),
    [sortBy, direction],
  );

  const sortDropdownProps = useMemo(
    () => ({ options, value: sortBy, onChange: setSortBy }),
    [options, sortBy, setSortBy],
  );

  const directionToggleProps = useMemo(
    () => ({ direction, onToggle: toggleDirection }),
    [direction, toggleDirection],
  );

  return {
    sortBy,
    direction,
    setSortBy,
    toggleDirection,
    reset,
    queryParams,
    sortDropdownProps,
    directionToggleProps,
  };
}
