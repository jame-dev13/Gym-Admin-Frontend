import {
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import type { OtpInputProps } from "@/types/Props";

const DEFAULT_LENGTH = 6;
const DEFAULT_LABEL = "Verification code";

const toTokenChar = (raw: string) =>
  raw.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();

export const OtpInput = ({
  length = DEFAULT_LENGTH,
  name,
  autoComplete = "one-time-code",
  required = false,
  disabled = false,
  "aria-label": ariaLabel = DEFAULT_LABEL,
  value: externalValue,
  onChange,
  onComplete,
}: OtpInputProps) => {
  const [internalValue, setInternalValue] = useState("");
  const value = externalValue ?? internalValue;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const setValue = (next: string) => {
    const token = next.slice(0, length).toUpperCase();
    if (externalValue === undefined) setInternalValue(token);
    onChange?.(token);
    if (token.length === length) onComplete?.(token);
  };

  const focusCell = useCallback((index: number) => {
    inputsRef.current[index]?.focus();
  }, []);

  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const char = toTokenChar(event.currentTarget.value);
      if (!char) return;
      const cells = value.split("");
      cells[index] = char;
      setValue(cells.join(""));
      if (index < length - 1) focusCell(index + 1);
    };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        const cells = value.split("");
        if (cells[index]) {
          cells[index] = "";
        } else if (index > 0) {
          cells[index - 1] = "";
          focusCell(index - 1);
        } else {
          return;
        }
        setValue(cells.join(""));
      } else if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        focusCell(index - 1);
      } else if (event.key === "ArrowRight" && index < length - 1) {
        event.preventDefault();
        focusCell(index + 1);
      }
    };

  const handlePaste =
    (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = toTokenChar(event.clipboardData.getData("text"));
      if (!pasted) return;
      const cells = value.split("");
      let cursor = index;
      for (const char of pasted) {
        if (cursor >= length) break;
        cells[cursor] = char;
        cursor += 1;
      }
      setValue(cells.join(""));
      focusCell(Math.min(cursor, length - 1));
    };

  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  }, []);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="tab:flex w-full place-content-center place-items-center gap-2.5 max-lg:grid max-lg:grid-cols-3"
    >
      {Array.from({ length }).map((_, index) => {
        const char = value[index] ?? "";
        const isFilled = Boolean(char);
        return (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="text"
            inputMode="text"
            maxLength={1}
            name={name}
            autoComplete={index === 0 ? autoComplete : "off"}
            required={required}
            disabled={disabled}
            value={char}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste(index)}
            onFocus={handleFocus}
            aria-label={`Character ${index + 1}`}
            className={`size-12 rounded-2xl border-2 bg-surface-secondary text-center text-xl font-bold tracking-widest text-text-primary caret-accent outline-none transition-colors duration-200 placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-50 ${isFilled ? "border-accent/40" : "border-border"} focus:border-accent focus:ring-2 focus:ring-accent/30`}
          />
        );
      })}
    </div>
  );
};