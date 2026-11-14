import { useCallback, useEffect, useState } from "react";

export const COUNTDOWN_STORAGE_KEY = "countdown";

const readStoredCountdown = (): number => {
  try {
    const stored = window.localStorage.getItem(COUNTDOWN_STORAGE_KEY);

    if (stored === null) return 0;

    const parsed = Number(stored);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
};

const persistCountdown = (remainingMs: number) => {
  try {
    if (remainingMs > 0) {
      window.localStorage.setItem(
        COUNTDOWN_STORAGE_KEY,
        String(remainingMs),
      );
      return;
    }

    window.localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The
    // countdown still works for the current mount in that case.
  }
};

const normalizeCountdown = (countdownTime?: number) => {
  if (countdownTime === undefined) return undefined;
  if (!Number.isFinite(countdownTime)) return 0;

  return Math.max(0, countdownTime);
};

export const formatCountdown = (remainingMs: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Counts down a duration in milliseconds and mirrors the remaining time in
 * localStorage so a remount can resume it. Passing a new duration restarts
 * the countdown; passing `0` stops it and clears the stored value; omitting it
 * consumes the value left by a previous mount.
 */
export const useCountdown = (countdownTime?: number) => {
  const normalizedCountdown = normalizeCountdown(countdownTime);
  const [remainingMs, setRemainingMs] = useState(() =>
    normalizedCountdown === undefined
      ? readStoredCountdown()
      : normalizedCountdown,
  );
  const [previousCountdown, setPreviousCountdown] =
    useState(normalizedCountdown);

  // Keep the state in sync with a new duration without an extra effect pass.
  if (normalizedCountdown !== previousCountdown) {
    setPreviousCountdown(normalizedCountdown);

    if (normalizedCountdown !== undefined) {
      setRemainingMs(normalizedCountdown);
    }
  }

  useEffect(() => {
    persistCountdown(remainingMs);
  }, [remainingMs]);

  const isActive = remainingMs > 0;

  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      setRemainingMs((current) => Math.max(0, current - 1000));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive]);

  const reset = useCallback((nextCountdown = 0) => {
    const next = normalizeCountdown(nextCountdown) ?? 0;

    setPreviousCountdown(next);
    setRemainingMs(next);
  }, []);

  const remainingSeconds = Math.ceil(remainingMs / 1000);

  return {
    remainingMs,
    remainingSeconds,
    formatted: formatCountdown(remainingMs),
    isActive,
    isExpired: remainingMs === 0,
    reset,
    timeLeft: remainingMs,
    countdown: remainingMs,
  };
};

export const useCountDown = useCountdown;
