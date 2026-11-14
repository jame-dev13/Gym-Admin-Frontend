import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  COUNTDOWN_STORAGE_KEY,
  formatCountdown,
  useCountdown,
} from "@/hooks/useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it("stores the duration and decreases it every second", () => {
    const { result } = renderHook(() => useCountdown(5000));

    expect(result.current.remainingMs).toBe(5000);
    expect(window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)).toBe("5000");

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.remainingMs).toBe(4000);
    expect(window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)).toBe("4000");
  });

  it("clears storage and reports the expired state at zero", () => {
    const { result } = renderHook(() => useCountdown(2000));

    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.remainingMs).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)).toBeNull();
  });

  it("consumes the stored duration when no new duration is provided", () => {
    window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, "3000");

    const { result } = renderHook(() => useCountdown());

    expect(result.current.remainingMs).toBe(3000);
    expect(result.current.formatted).toBe("00:03");
  });

  it("restarts when the duration changes and stops when set to zero", () => {
    const { result, rerender } = renderHook(
      ({ countdownTime }: { countdownTime: number }) =>
        useCountdown(countdownTime),
      { initialProps: { countdownTime: 5000 } },
    );

    rerender({ countdownTime: 9000 });
    expect(result.current.remainingMs).toBe(9000);

    rerender({ countdownTime: 0 });
    expect(result.current.remainingMs).toBe(0);
    expect(window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)).toBeNull();
  });

  it("formats durations as minutes and seconds", () => {
    expect(formatCountdown(80_000)).toBe("01:20");
    expect(formatCountdown(0)).toBe("00:00");
  });
});
