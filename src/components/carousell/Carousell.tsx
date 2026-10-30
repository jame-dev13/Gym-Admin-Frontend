import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { CarousellItem, CarousellProps } from "./CarousellTypes";

const DEFAULT_AUTOPLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 48;
const AXIS_LOCK_THRESHOLD = 6;
const EDGE_RESISTANCE = 0.3;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const focusRing = [
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface-raised",
].join(" ");

const arrowButtonStyles = [
  "inline-flex",
  "size-11",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-full",
  "border",
  "border-transparent",
  "text-text-secondary",
  "transition-all",
  "duration-200",
  "enabled:hover:border-border-emphasis",
  "enabled:hover:bg-surface-over",
  "enabled:hover:text-accent",
  "enabled:active:scale-95",
  "disabled:cursor-not-allowed",
  "disabled:opacity-35",
  "sm:size-10",
  focusRing,
].join(" ");

const autoPlayButtonStyles = [
  "inline-flex",
  "size-10",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-full",
  "text-text-tertiary",
  "transition-all",
  "duration-200",
  "hover:bg-surface-over",
  "hover:text-accent",
  "active:scale-95",
  "sm:size-9",
  focusRing,
].join(" ");

const dotButtonStyles = [
  "group",
  "inline-flex",
  "size-7",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-full",
  focusRing,
].join(" ");

const dotIndicatorStyles = [
  "h-1.5",
  "rounded-full",
  "transition-all",
  "duration-300",
  "ease-out",
].join(" ");

type CarousellSlideProps = {
  item: CarousellItem;
  position: number;
  total: number;
  active: boolean;
};

const CarousellSlide = memo(function CarousellSlide({
  item,
  position,
  total,
  active,
}: CarousellSlideProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${total}: ${item.label}`}
      aria-hidden={!active}
      inert={!active}
      data-active={active ? "true" : undefined}
      className={[
        "w-full",
        "min-w-0",
        "shrink-0",
        "grow-0",
        "basis-full",
        "transition-opacity",
        "duration-300",
        "motion-reduce:transition-none",
        active ? "opacity-100" : "opacity-90",
        item.padded === false ? "" : "p-3 sm:p-4",
        item.className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {item.content}
    </div>
  );
});

CarousellSlide.displayName = "CarousellSlide";

function clampIndex(index: number, total: number): number {
  if (total < 1 || !Number.isFinite(index)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(index), 0), total - 1);
}

function resolveIndex(index: number, total: number, loop: boolean): number {
  if (total < 1 || !Number.isFinite(index)) {
    return 0;
  }

  const target = Math.trunc(index);

  return loop ? ((target % total) + total) % total : clampIndex(target, total);
}

function trackTransform(index: number, offset = 0): string {
  if (offset === 0) {
    return `translate3d(-${index * 100}%, 0, 0)`;
  }

  return `translate3d(calc(-${index * 100}% + ${offset}px), 0, 0)`;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
      ? window.matchMedia(REDUCED_MOTION_QUERY).matches
      : false,
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const query = window.matchMedia(REDUCED_MOTION_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      setVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return visible;
}

type Gesture = {
  pointerId: number;
  x: number;
  y: number;
  startIndex: number;
  axis: "x" | "y" | null;
};

function CarousellComponent({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  autoPlayInterval = DEFAULT_AUTOPLAY_INTERVAL,
  onIndexChange,
  showControls = true,
  "aria-label": ariaLabel = "Carousel",
  className = "",
}: CarousellProps) {
  const count = items.length;
  const reducedMotion = usePrefersReducedMotion();
  const documentVisible = useDocumentVisible();

  const [index, setIndex] = useState(() => clampIndex(initialIndex, count));
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);

  // Derived instead of adjusted through an effect, so a shrinking item list
  // never triggers a cascading render.
  const activeIndex = clampIndex(index, count);
  const currentItem = items[activeIndex] ?? items[0];

  const interval =
    Number.isFinite(autoPlayInterval) && autoPlayInterval > 0
      ? autoPlayInterval
      : DEFAULT_AUTOPLAY_INTERVAL;

  const goTo = useCallback(
    (target: number) => {
      if (count < 1) {
        return;
      }

      const next = resolveIndex(target, count, loop);

      if (next === activeIndex) {
        if (index !== next) {
          setIndex(next);
        }
        return;
      }

      setIndex(next);
      onIndexChange?.(next);
    },
    [activeIndex, count, index, loop, onIndexChange],
  );

  const previous = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const shouldAutoPlay =
    autoPlay &&
    showControls &&
    count > 1 &&
    !manualPaused &&
    !hovered &&
    !focused &&
    !reducedMotion &&
    documentVisible;

  useEffect(() => {
    if (!shouldAutoPlay || (!loop && activeIndex >= count - 1)) {
      return;
    }

    const timer = window.setTimeout(() => {
      goTo(activeIndex + 1);
    }, interval);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeIndex, count, goTo, interval, loop, shouldAutoPlay]);

  /**
   * Drag feedback is written straight to the DOM: React state is reserved for
   * the settled slide, so charts inside the slides are never re-rendered while
   * the pointer moves.
   */
  const moveTrack = (slideIndex: number, offset: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.style.transform = trackTransform(slideIndex, offset);
  };

  const settleTrack = (slideIndex: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    // Clearing the inline duration restores the class transition, so the
    // pointer release animates back into place.
    track.style.transitionDuration = "";
    track.style.transform = trackTransform(slideIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const tagName = target?.tagName;

    if (
      target?.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT"
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      typeof Node !== "undefined" &&
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setFocused(false);
  };

  // Touch screens emit pointerenter with pointerType "touch" on tap, which
  // would otherwise leave the carousel paused forever.
  const handleHoverStart = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setHovered(true);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (count < 2 || event.pointerType === "mouse") {
      return;
    }

    gestureRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startIndex: activeIndex,
      axis: null,
    };

    const track = trackRef.current;

    if (track) {
      track.style.transitionDuration = "0ms";
    }

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;

    if (!gesture || gesture.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - gesture.x;
    const deltaY = event.clientY - gesture.y;

    if (
      gesture.axis === null &&
      Math.abs(deltaX) < AXIS_LOCK_THRESHOLD &&
      Math.abs(deltaY) < AXIS_LOCK_THRESHOLD
    ) {
      return;
    }

    gesture.axis ??= Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";

    if (gesture.axis === "y") {
      return;
    }

    const beyondStart = !loop && gesture.startIndex === 0 && deltaX > 0;
    const beyondEnd =
      !loop && gesture.startIndex === count - 1 && deltaX < 0;
    const offset =
      beyondStart || beyondEnd ? deltaX * EDGE_RESISTANCE : deltaX;

    moveTrack(gesture.startIndex, offset);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;

    if (!gesture || gesture.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - gesture.x;
    const deltaY = event.clientY - gesture.y;
    const horizontal = Math.abs(deltaX) > Math.abs(deltaY);
    const swiped =
      horizontal && Math.abs(deltaX) >= SWIPE_THRESHOLD && deltaX !== 0;

    const target = swiped
      ? resolveIndex(
          gesture.startIndex + (deltaX < 0 ? 1 : -1),
          count,
          loop,
        )
      : gesture.startIndex;

    settleTrack(target);
    goTo(target);
  };

  const handlePointerCancel = () => {
    const gesture = gestureRef.current;
    gestureRef.current = null;

    if (gesture) {
      settleTrack(gesture.startIndex);
    }
  };

  if (!currentItem) {
    return (
      <div
        role="status"
        className={[
          "flex",
          "min-h-40",
          "w-full",
          "items-center",
          "justify-center",
          "rounded-xl",
          "border",
          "border-border",
          "bg-surface-raised",
          "px-4",
          "py-8",
          "text-sm",
          "text-text-tertiary",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        No content available
      </div>
    );
  }

  const atStart = !loop && activeIndex === 0;
  const atEnd = !loop && activeIndex === count - 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerEnter={handleHoverStart}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
      className={[
        "relative",
        "w-full",
        "overflow-hidden",
        "rounded-xl",
        "border",
        "border-border",
        "bg-surface-raised",
        "text-text-primary",
        "shadow-sm",
        focusRing,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />

      <div
        data-testid="carousell-viewport"
        className="touch-pan-y overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          ref={trackRef}
          data-testid="carousell-track"
          className="flex items-stretch transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-safe:will-change-transform"
          style={{ transform: trackTransform(activeIndex) }}
        >
          {items.map((item, itemIndex) => (
            <CarousellSlide
              key={item.id}
              item={item}
              position={itemIndex + 1}
              total={count}
              active={itemIndex === activeIndex}
            />
          ))}
        </div>
      </div>

      {showControls && count > 1 ? (
        <div className="flex items-center gap-1.5 border-t border-border bg-surface-over/30 px-2 py-2 sm:gap-2 sm:px-3">
          <button
            type="button"
            onClick={previous}
            disabled={atStart}
            aria-label="Previous slide"
            title="Previous slide"
            className={arrowButtonStyles}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <p className="flex max-w-full items-center gap-1.5 px-1 text-xs">
              <span className="shrink-0 tabular-nums text-text-tertiary">
                {activeIndex + 1} / {count}
              </span>
              <span className="truncate font-medium text-text-secondary">
                {currentItem.label}
              </span>
            </p>

            <div className="flex max-w-full flex-wrap items-center justify-center gap-0.5">
              {items.map((item, itemIndex) => {
                const active = itemIndex === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(itemIndex)}
                    aria-label={`Go to slide ${itemIndex + 1}: ${item.label}`}
                    aria-current={active ? "true" : undefined}
                    title={item.label}
                    className={dotButtonStyles}
                  >
                    <span
                      aria-hidden="true"
                      className={`${dotIndicatorStyles} ${
                        active
                          ? "w-5 bg-accent"
                          : "w-1.5 bg-border-emphasis group-hover:bg-text-tertiary"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {autoPlay && !reducedMotion ? (
            <button
              type="button"
              onClick={() => setManualPaused((paused) => !paused)}
              aria-label={manualPaused ? "Resume autoplay" : "Pause autoplay"}
              title={manualPaused ? "Resume autoplay" : "Pause autoplay"}
              className={autoPlayButtonStyles}
            >
              {manualPaused ? (
                <Play size={16} aria-hidden="true" />
              ) : (
                <Pause size={16} aria-hidden="true" />
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={next}
            disabled={atEnd}
            aria-label="Next slide"
            title="Next slide"
            className={arrowButtonStyles}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <p
        className="sr-only"
        aria-live={shouldAutoPlay ? "off" : "polite"}
        aria-atomic="true"
      >
        Slide {activeIndex + 1} of {count}: {currentItem.label}
      </p>
    </div>
  );
}

export const Carousell = memo(CarousellComponent);
Carousell.displayName = "Carousell";
