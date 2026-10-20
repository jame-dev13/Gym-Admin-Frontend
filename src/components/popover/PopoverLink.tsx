import { usePopoverContext } from "@/context/usePopoverContext";
import { useState } from "react";
import type {
  PopoverLinkColor,
  PopoverLinkLook,
  PopoverLinkProps,
} from "./PopoverTypes";

type PopoverLinkColorClasses = {
  link: string;
  pill: string;
  commandBtn: string;
  icon: string;
  focus: string;
};

const colorClasses: Record<PopoverLinkColor, PopoverLinkColorClasses> = {
  cyan: {
    link: "text-accent hover:text-accent-emphasis",
    pill: "bg-accent/10 text-accent-emphasis hover:bg-accent/20",
    commandBtn: "hover:border-accent hover:bg-accent/10",
    icon: "text-accent",
    focus: "focus-visible:outline-accent",
  },
  blue: {
    link: "text-popover-blue hover:text-popover-blue-emphasis",
    pill: "bg-popover-blue/10 text-popover-blue-emphasis hover:bg-popover-blue/20",
    commandBtn: "hover:border-popover-blue hover:bg-popover-blue/10",
    icon: "text-popover-blue",
    focus: "focus-visible:outline-popover-blue",
  },
  red: {
    link: "text-danger hover:text-danger-emphasis",
    pill: "bg-danger/10 text-danger-emphasis hover:bg-danger/20",
    commandBtn: "hover:border-danger hover:bg-danger/10",
    icon: "text-danger",
    focus: "focus-visible:outline-danger",
  },
  slate: {
    link: "text-text-secondary hover:text-text-primary",
    pill: "bg-text-secondary/10 text-text-secondary hover:bg-text-secondary/20",
    commandBtn: "hover:border-text-secondary hover:bg-text-secondary/10",
    icon: "text-text-secondary",
    focus: "focus-visible:outline-text-secondary",
  },
};

const baseStyles = [
  "inline-flex",
  "items-center",
  "font-medium",
  "transition-colors",
  "duration-200",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
].join(" ");

const lookStyles: Record<PopoverLinkLook, string> = {
  link: "gap-1 rounded underline decoration-dotted underline-offset-4",
  pill: "justify-center gap-2 rounded-full px-5 py-1.5",
  commandBtn:
    "justify-center gap-2 rounded-lg border border-border bg-surface-raised text-text-primary hover:bg-surface-over",
};

const iconStyles =
  "inline-flex shrink-0 items-center justify-center [&>svg]:size-[18px]";

export const PopoverLink = <T,>({
  data,
  render,
  label,
  children,
  icon,
  color = "cyan",
  look = "link",
  className = "",
}: PopoverLinkProps<T>) => {
  const { isOpen, activePopover, togglePopover } = usePopoverContext();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const isActive = isOpen && activePopover?.anchor === anchor;

  const palette = colorClasses[color];
  const hasVisibleLabel =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== "";

  if (!hasVisibleLabel && label.trim() === "") {
    throw new Error(
      "PopoverLink requires a non-empty `label` when it has no visible label",
    );
  }

  return (
    <button
      ref={setAnchor}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isActive}
      aria-label={hasVisibleLabel ? undefined : label}
      onClick={() => {
        if (!anchor) {
          return;
        }
        togglePopover({ anchor, data, render, label });
      }}
      className={[
        baseStyles,
        lookStyles[look],
        look === "commandBtn" && !hasVisibleLabel ? "size-11" : "",
        look === "commandBtn" && hasVisibleLabel ? "px-5 py-2.5" : "",
        palette[look],
        palette.focus,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <span aria-hidden="true" className={`${iconStyles} ${palette.icon}`}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
