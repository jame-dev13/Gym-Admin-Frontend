import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { DropdownOption } from "@/types/Types";
import type {
  DropdownPlacement,
  DropdownProps,
  DropdownSize,
} from "@/types/Props";
import "./Dropdown.css";

const sizeTriggerClasses: Record<DropdownSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

const sizeItemClasses: Record<DropdownSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
};

const placementClasses: Record<DropdownPlacement, string> = {
  "bottom-start": "left-0",
  "bottom-end": "right-0",
};

function firstEnabledIndex(options: DropdownOption[]): number {
  return options.findIndex((option) => !option.disabled);
}

function lastEnabledIndex(options: DropdownOption[]): number {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }
  return -1;
}

function nextEnabledIndex(
  options: DropdownOption[],
  from: number,
  direction: 1 | -1,
): number {
  let index = from;
  for (let step = 0; step < options.length; step += 1) {
    index = (index + direction + options.length) % options.length;
    if (!options[index]?.disabled) {
      return index;
    }
  }
  return from;
}

export const Dropdown = ({
  options,
  value,
  defaultValue,
  onSelect,
  label,
  Icon,
  trigger,
  placeholder = "Select an option",
  disabled = false,
  size = "md",
  placement = "bottom-start",
  "aria-label": ariaLabel,
  className = "",
}: DropdownProps) => {
  if (options.length === 0) {
    throw new Error("Dropdown requires at least one option");
  }

  const triggerId = useId();
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(() =>
    firstEnabledIndex(options),
  );

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const triggerText = selectedOption?.label ?? label ?? placeholder;

  const openMenu = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeMenu = (refocusTrigger: boolean) => {
    setIsOpen(false);
    if (refocusTrigger) {
      triggerRef.current?.focus();
    }
  };

  const selectOption = (option: DropdownOption) => {
    if (option.disabled) {
      return;
    }
    if (value === undefined) {
      setInternalValue(option.value);
    }
    onSelect?.(option.value);
    closeMenu(true);
  };

  useEffect(() => {
    if (isOpen) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (isOpen || disabled) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(firstEnabledIndex(options));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(lastEnabledIndex(options));
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => nextEnabledIndex(options, current, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => nextEnabledIndex(options, current, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(firstEnabledIndex(options));
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(lastEnabledIndex(options));
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        disabled={disabled}
        onClick={() =>
          isOpen
            ? closeMenu(false)
            : openMenu(
                selectedOption
                  ? options.indexOf(selectedOption)
                  : firstEnabledIndex(options),
              )
        }
        onKeyDown={handleTriggerKeyDown}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface-raised font-medium text-text-primary transition-all duration-150 hover:border-border-emphasis hover:bg-surface-over focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizeTriggerClasses[size]}`}
      >
        {trigger ?? (
          <span className="inline-flex min-w-0 items-center gap-2">
            {Icon && <Icon size={16} aria-hidden="true" className="shrink-0" />}
            <span className="truncate">{triggerText}</span>
          </span>
        )}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={handleMenuKeyDown}
          className={`dropdown-panel absolute top-full z-50 mt-2 min-w-56 overflow-y-auto rounded-2xl border border-border bg-surface-raised p-1.5 shadow-xl animate-fade-in-scale ${placementClasses[placement]}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const OptionIcon = option.Icon;
            return (
              <button
                key={option.value}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                disabled={option.disabled}
                tabIndex={-1}
                onClick={() => selectOption(option)}
                style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
                className={`dropdown-item group flex w-full items-start gap-2.5 rounded-xl text-left transition-all duration-150 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 ${sizeItemClasses[size]} ${
                  isSelected
                    ? "bg-surface-over text-text-primary"
                    : "text-text-primary hover:bg-surface-over"
                }`}
              >
                {OptionIcon && (
                  <OptionIcon
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-text-secondary transition-colors duration-150 group-hover:text-accent"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="block truncate text-xs text-text-secondary">
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <Check
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent animate-fade-in-scale"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
