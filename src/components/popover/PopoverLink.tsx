import { usePopoverContext } from "@/context/usePopoverContext";
import { useState } from "react";
import type { PopoverLinkProps } from "./PopoverTypes";

export const PopoverLink = <T,>({
  data,
  render,
  label,
  children,
  className = "",
}: PopoverLinkProps<T>) => {
  const { isOpen, activePopover, togglePopover } = usePopoverContext();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const isActive = isOpen && activePopover?.anchor === anchor;

  return (
    <button
      ref={setAnchor}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isActive}
      onClick={() => {
        if (!anchor) {
          return;
        }
        togglePopover({ anchor, data, render, label });
      }}
      className={`inline-flex items-center gap-1 rounded font-medium text-accent underline decoration-dotted underline-offset-4 transition-colors duration-200 hover:text-accent-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {children}
    </button>
  );
};
