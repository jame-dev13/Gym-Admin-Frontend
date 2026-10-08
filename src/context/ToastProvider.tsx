import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "@/components/toast/Toast";
import type { ToastProviderProps } from "@/components/toast/ToastTypes";
import type { ToastType } from "@/types/Types";
import { ToastContext, TOAST_DURATION_MS } from "./ToastContext";

type ActiveToast = {
  id: number;
  message: string;
  type: ToastType;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [active, setActive] = useState<ActiveToast | null>(null);
  const idRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const deadlineRef = useRef(0);
  const remainingRef = useRef(TOAST_DURATION_MS);

  const clearTimer = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  };

  const hide = useCallback(() => {
    clearTimer();
    remainingRef.current = TOAST_DURATION_MS;
    setActive(null);
  }, []);

  const show = useCallback((message: string, type: ToastType = "default") => {
    if (!message.trim()) {
      throw new Error("Toast message must not be empty");
    }
    remainingRef.current = TOAST_DURATION_MS;
    idRef.current += 1;
    setActive({ id: idRef.current, message, type });
  }, []);

  const pause = useCallback(() => {
    if (timeoutRef.current === undefined) {
      return;
    }
    clearTimer();
    remainingRef.current = Math.max(0, deadlineRef.current - Date.now());
  }, []);

  const resume = useCallback(() => {
    if (active === null || timeoutRef.current !== undefined) {
      return;
    }
    deadlineRef.current = Date.now() + remainingRef.current;
    timeoutRef.current = window.setTimeout(hide, remainingRef.current);
  }, [active, hide]);

  useEffect(() => {
    if (active === null) {
      return;
    }

    clearTimer();
    deadlineRef.current = Date.now() + remainingRef.current;
    timeoutRef.current = window.setTimeout(hide, remainingRef.current);

    return clearTimer;
  }, [active, hide]);

  // Stable callbacks + memoized value: without them every provider render
  // would hand consumers a new context identity and re-render them all.
  // The viewport key remounts per toast so the progress bar restarts.
  const value = useMemo(
    () => ({
      message: active?.message ?? "",
      type: active?.type ?? "default",
      isShowing: active !== null,
      show,
      hide,
      pause,
      resume,
    }),
    [active, show, hide, pause, resume],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast key={active?.id ?? 0} />
    </ToastContext.Provider>
  );
};
