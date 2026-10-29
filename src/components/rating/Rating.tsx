import { Star } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { RatingProps, RatingSize } from "./RatingTypes";

const STAR_COUNT = 5;
const DEFAULT_STEP = 0.01;

const starSizes: Record<RatingSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

const starGapClasses: Record<RatingSize, string> = {
  sm: "gap-0.5",
  md: "gap-0.5",
  lg: "gap-1",
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeValue(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value)
    ? clamp(value)
    : 0;
}

function countDecimals(value: number): number {
  const text = String(value);

  if (text.includes("e-")) {
    return Number(text.split("e-")[1]);
  }

  const dotIndex = text.indexOf(".");
  return dotIndex === -1 ? 0 : text.length - dotIndex - 1;
}

function quantize(value: number, step: number): number {
  const clamped = clamp(value);

  if (!Number.isFinite(step) || step <= 0) {
    return clamped;
  }

  return Number(
    (Math.round(clamped / step) * step).toFixed(countDecimals(step)),
  );
}

function formatStars(value: number): string {
  const stars = clamp(value) * STAR_COUNT;
  return stars.toFixed(2).replace(/\.?0+$/, "");
}

function RatingComponent({
  value,
  defaultValue,
  onChange,
  name,
  step = DEFAULT_STEP,
  readOnly = false,
  disabled = false,
  size = "sm",
  label = "Rating",
  className = "",
  id,
}: RatingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [initialValue] = useState(() => normalizeValue(defaultValue));
  const [internalValue, setInternalValue] = useState(initialValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const draggingRef = useRef(false);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? normalizeValue(value) : internalValue;
  const resolvedStep = Number.isFinite(step) && step > 0 ? step : DEFAULT_STEP;
  const isSlider = !readOnly;
  const interactive = isSlider && !disabled;
  const displayedValue = interactive ? (hoverValue ?? currentValue) : currentValue;
  const filledStars = displayedValue * STAR_COUNT;
  const starSize = starSizes[size];
  const starsLabel = `${formatStars(currentValue)} out of 5 stars`;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const form = rootRef.current?.closest("form");

    if (!form) {
      return;
    }

    const handleReset = () => {
      setHoverValue(null);
      setInternalValue(initialValue);
    };

    form.addEventListener("reset", handleReset);

    return () => form.removeEventListener("reset", handleReset);
  }, [initialValue, isControlled]);

  const commitValue = useCallback(
    (nextValue: number) => {
      const normalizedNextValue = quantize(nextValue, resolvedStep);

      if (normalizedNextValue === currentValue) {
        return;
      }

      if (!isControlled) {
        setInternalValue(normalizedNextValue);
      }

      onChange?.(normalizedNextValue);
    },
    [currentValue, isControlled, onChange, resolvedStep],
  );

  const valueFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>): number => {
      const bounds = event.currentTarget.getBoundingClientRect();

      if (bounds.width === 0) {
        return currentValue;
      }

      const ratio = (event.clientX - bounds.left) / bounds.width;
      return quantize(ratio, resolvedStep);
    },
    [currentValue, resolvedStep],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture?.(event.pointerId);
    draggingRef.current = true;

    const nextValue = valueFromPointer(event);
    setHoverValue(nextValue);
    commitValue(nextValue);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const nextValue = valueFromPointer(event);
    setHoverValue(nextValue);

    if (draggingRef.current) {
      commitValue(nextValue);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setHoverValue(null);
  };

  const handlePointerLeave = () => {
    if (!draggingRef.current) {
      setHoverValue(null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    let nextValue: number;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        nextValue = currentValue + resolvedStep;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        nextValue = currentValue - resolvedStep;
        break;
      case "PageUp":
        nextValue = currentValue + resolvedStep * 10;
        break;
      case "PageDown":
        nextValue = currentValue - resolvedStep * 10;
        break;
      case "Home":
        nextValue = 0;
        break;
      case "End":
        nextValue = 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setHoverValue(null);
    commitValue(nextValue);
  };

  return (
    <div
      ref={rootRef}
      id={id}
      role={isSlider ? "slider" : "img"}
      aria-label={isSlider ? label : `${label}: ${starsLabel}`}
      aria-valuemin={isSlider ? 0 : undefined}
      aria-valuemax={isSlider ? 1 : undefined}
      aria-valuenow={isSlider ? Number(currentValue.toFixed(3)) : undefined}
      aria-valuetext={isSlider ? starsLabel : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive ? 0 : undefined}
      title={`${formatStars(currentValue)} out of 5 stars`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      className={[
        "inline-flex select-none items-center rounded-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        interactive ? "cursor-pointer touch-none" : "",
        disabled ? "pointer-events-none opacity-50" : "",
        starGapClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
          disabled={disabled}
        />
      )}

      {Array.from({ length: STAR_COUNT }, (_, index) => {
        const fill = clamp(filledStars - index, 0, 1);

        return (
          <span
            key={index}
            data-rating-star=""
            className="relative inline-flex shrink-0"
            style={{ width: starSize, height: starSize }}
          >
            <Star
              size={starSize}
              strokeWidth={1.5}
              aria-hidden="true"
              className="block text-border-emphasis"
            />
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={starSize}
                strokeWidth={1.5}
                fill="currentColor"
                className="block max-w-none text-warning"
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export const Rating = memo(RatingComponent);
Rating.displayName = "Rating";
