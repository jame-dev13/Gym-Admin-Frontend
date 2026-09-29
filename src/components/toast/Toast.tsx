import {
  Bell,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { TOAST_DURATION_MS } from "@/context/ToastContext";
import { useToastContext } from "@/context/useToastContext";
import type { ToastType } from "@/types/Types";

type ToastTone = {
  Icon: LucideIcon;
  text: string;
  bar: string;
};

const tone: Record<ToastType, ToastTone> = {
  success: { Icon: CheckCircle2, text: "text-success", bar: "bg-success" },
  error: { Icon: XCircle, text: "text-danger", bar: "bg-danger" },
  warning: { Icon: TriangleAlert, text: "text-warning", bar: "bg-warning" },
  info: { Icon: Info, text: "text-accent", bar: "bg-accent" },
  default: {
    Icon: Bell,
    text: "text-text-secondary",
    bar: "bg-text-secondary",
  },
};

export const Toast = () => {
  const { message, type, isShowing, hide, pause, resume } = useToastContext();
  const [progress, setProgress] = useState(100);
  const { Icon, text, bar } = tone[type];

  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  // Display-only progress: the provider owns the auto-hide timer, this loop
  // only drives the bar width. Frames landing while paused are skipped so
  // the bar tracks the paused timer instead of drifting from it.
  useEffect(() => {
    if (!isShowing) {
      return;
    }

    pausedRef.current = false;
    const setupProgress = () => setProgress(100);
    setupProgress();

    let elapsed = 0;
    let last = performance.now();

    const tick = (time: number) => {
      const delta = time - last;
      last = time;

      if (!pausedRef.current) {
        elapsed += delta;
        setProgress(Math.max(0, 100 - (elapsed / TOAST_DURATION_MS) * 100));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isShowing, type, message]);

  useEffect(() => {
    if (!isShowing) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hide();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isShowing, hide]);

  if (!isShowing) {
    return null;
  }

  const handlePause = () => {
    pausedRef.current = true;
    pause();
  };

  const handleResume = () => {
    resume();
    pausedRef.current = false;
  };

  return createPortal(
    <div
      role="status"
      aria-live={type === "error" ? "assertive" : "polite"}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
      className="fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))] animate-fade-in-scale tab:bottom-6 tab:top-auto"
    >
      <div className="grid grid-cols-1 items-start gap-3 rounded-2xl border border-border bg-surface-raised p-4 text-text-primary shadow-xl">
        <section className="flex gap-3 items-center">
          <Icon
            size={20}
            aria-hidden="true"
            className={`mt-0.5 shrink-0 ${text}`}
          />
          <p className="flex-1 text-sm">{message}</p>
          <button
            type="button"
            aria-label="Close toast"
            onClick={hide}
            className="rounded-full p-1 text-text-secondary transition-colors hover:bg-surface-over hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </section>
        <div className="overflow-hidden rounded-2xl">
          <div
            data-testid="toast-progress"
            aria-hidden="true"
            style={{ width: `${progress}%` }}
            className={`h-0.5 ${bar}`}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
