import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSortControls } from "./useSortControls";
import type { SortOption } from "@/types/Types";

const options: SortOption<"name" | "date" | "plan">[] = [
  { value: "name", label: "Name" },
  { value: "date", label: "Start date" },
  { value: "plan", label: "Plan", disabled: true },
];

describe("useSortControls", () => {
  it("defaults to the first enabled option and ascending direction", () => {
    const { result } = renderHook(() => useSortControls({ options }));

    expect(result.current.sortBy).toBe("name");
    expect(result.current.direction).toBe("asc");
    expect(result.current.queryParams).toEqual({
      sortBy: "name",
      direction: "asc",
    });
  });

  it("respects initial sort and direction", () => {
    const { result } = renderHook(() =>
      useSortControls({
        options,
        initialSortBy: "date",
        initialDirection: "desc",
      }),
    );

    expect(result.current.sortBy).toBe("date");
    expect(result.current.direction).toBe("desc");
  });

  it("updates the field and notifies onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSortControls({ options, onChange }),
    );

    act(() => {
      result.current.setSortBy("date");
    });

    expect(result.current.sortBy).toBe("date");
    expect(onChange).toHaveBeenCalledWith({
      sortBy: "date",
      direction: "asc",
    });
  });

  it("toggles direction back and forth and notifies", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSortControls({ options, onChange }),
    );

    act(() => {
      result.current.toggleDirection();
    });
    expect(result.current.direction).toBe("desc");

    act(() => {
      result.current.toggleDirection();
    });
    expect(result.current.direction).toBe("asc");
    expect(onChange).toHaveBeenLastCalledWith({
      sortBy: "name",
      direction: "asc",
    });
  });

  it("resets to the initial state", () => {
    const { result } = renderHook(() =>
      useSortControls({
        options,
        initialSortBy: "date",
        initialDirection: "desc",
      }),
    );

    act(() => {
      result.current.setSortBy("name");
      result.current.toggleDirection();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.sortBy).toBe("date");
    expect(result.current.direction).toBe("desc");
  });

  it("exposes spread-ready props for the two components", () => {
    const { result } = renderHook(() => useSortControls({ options }));

    expect(result.current.sortDropdownProps.value).toBe(
      result.current.sortBy,
    );
    expect(result.current.directionToggleProps.direction).toBe(
      result.current.direction,
    );

    act(() => {
      result.current.sortDropdownProps.onChange("date");
    });
    expect(result.current.sortBy).toBe("date");

    act(() => {
      result.current.directionToggleProps.onToggle();
    });
    expect(result.current.direction).toBe("desc");
  });

  it("throws on empty options", () => {
    expect(() => renderHook(() => useSortControls({ options: [] }))).toThrow(
      "useSortControls requires at least one sort option",
    );
  });

  it("throws on unknown initial or selected values", () => {
    expect(() =>
      renderHook(() =>
        useSortControls<"name" | "date" | "plan">({
          options,
          // @ts-expect-error intentional invalid value for fail-fast test
          initialSortBy: "unknown",
        }),
      ),
    ).toThrow('useSortControls received unknown sort value "unknown"');

    const { result } = renderHook(() => useSortControls({ options }));
    expect(() =>
      act(() => {
        // @ts-expect-error intentional invalid value for fail-fast test
        result.current.setSortBy("unknown");
      }),
    ).toThrow('useSortControls received unknown sort value "unknown"');
  });
});
