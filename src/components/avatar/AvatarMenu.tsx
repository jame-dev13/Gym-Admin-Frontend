import { ChevronDown, LogOut, Settings, SunMoon, UserRound } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { resolveAvatarMenuPlacement } from "./resolveAvatarMenuPlacement";
import type { AvatarMenuProps } from "./AvatarTypes";
import type { DropdownPlacement } from "@/components/dropdown/DropdownTypes";
import type { AvatarMenuItem } from "@/types/SharedTypes";
import "./Avatar.css";

const placementClasses: Record<DropdownPlacement, string> = {
  "bottom-start": "left-0",
  "bottom-end": "right-0",
};

const defaultAvatarMenuItems: AvatarMenuItem[] = [
  { value: "profile", label: "Profile", description: "View your account", Icon: UserRound },
  { value: "settings", label: "Settings", description: "Preferences & gym setup", Icon: Settings },
  { value: "theme", label: "Toggle theme", description: "Switch dark / light", Icon: SunMoon },
  { value: "logout", label: "Log out", description: "End your session", Icon: LogOut, destructive: true },
];

function firstEnabledIndex(items: AvatarMenuItem[]): number {
  return items.findIndex((item) => !item.disabled);
}

function lastEnabledIndex(items: AvatarMenuItem[]): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index]?.disabled) {
      return index;
    }
  }
  return -1;
}

function nextEnabledIndex(
  items: AvatarMenuItem[],
  from: number,
  direction: 1 | -1,
): number {
  let index = from;
  for (let step = 0; step < items.length; step += 1) {
    index = (index + direction + items.length) % items.length;
    if (!items[index]?.disabled) {
      return index;
    }
  }
  return from;
}

export const AvatarMenu = ({
  user,
  items = defaultAvatarMenuItems,
  onAction,
  size = "md",
  placement = "auto",
  disabled = false,
  "aria-label": ariaLabel,
  className = "",
}: AvatarMenuProps) => {
  if (items.length === 0) {
    throw new Error("AvatarMenu requires at least one item");
  }

  const triggerId = useId();
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => firstEnabledIndex(items));
  const [resolvedPlacement, setResolvedPlacement] = useState<DropdownPlacement>(
    placement === "auto" ? "bottom-end" : placement,
  );

  const accessibleName = ariaLabel ?? (user.name ? `Account menu for ${user.name}` : "Account menu");

  const openMenu = (index: number) => {
    setActiveIndex(index);
    const trigger = triggerRef.current?.getBoundingClientRect();
    setResolvedPlacement(
      resolveAvatarMenuPlacement(
        placement,
        { left: trigger?.left ?? 0, right: trigger?.right ?? 0 },
        window.innerWidth,
      ),
    );
    setIsOpen(true);
  };

  const closeMenu = (refocusTrigger: boolean) => {
    setIsOpen(false);
    if (refocusTrigger) {
      triggerRef.current?.focus();
    }
  };

  const selectItem = (item: AvatarMenuItem) => {
    if (item.disabled) {
      return;
    }
    onAction?.(item.value);
    closeMenu(true);
  };

  useEffect(() => {
    if (isOpen) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen || placement !== "auto") {
      return;
    }
    const onResize = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      setResolvedPlacement(
        resolveAvatarMenuPlacement(
          placement,
          { left: trigger?.left ?? 0, right: trigger?.right ?? 0 },
          window.innerWidth,
        ),
      );
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, placement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isOpen || disabled) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(firstEnabledIndex(items));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(lastEnabledIndex(items));
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => nextEnabledIndex(items, current, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => nextEnabledIndex(items, current, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(firstEnabledIndex(items));
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(lastEnabledIndex(items));
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
        aria-label={accessibleName}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        disabled={disabled}
        onClick={() => (isOpen ? closeMenu(false) : openMenu(firstEnabledIndex(items)))}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center gap-1.5 rounded-full p-1 transition-all duration-150 hover:bg-surface-over focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Avatar name={user.name} src={user.src} size={size} status={user.status} />
        <ChevronDown
          size={14}
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
          className={`avatar-menu-panel absolute top-full z-50 mt-2 w-64 overflow-y-auto rounded-2xl border border-border bg-surface-raised p-1.5 shadow-xl animate-fade-in-scale ${placementClasses[resolvedPlacement]}`}
        >
          <div className="mb-1 flex items-center gap-3 border-b border-border px-2 pt-1.5 pb-2.5">
            <Avatar name={user.name} src={user.src} size="sm" status="none" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-text-primary">
                {user.name || "Account"}
              </span>
              <span className="block truncate text-xs text-text-secondary">{user.email}</span>
            </span>
          </div>

          {items.map((item, index) => {
            const ItemIcon = item.Icon;
            const destructive = item.destructive && !item.disabled;
            return (
              <button
                key={item.value}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                tabIndex={-1}
                onClick={() => selectItem(item)}
                style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
                className={`avatar-menu-item group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-all duration-150 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 ${
                  destructive
                    ? "text-danger hover:bg-danger/10"
                    : "text-text-primary hover:bg-surface-over"
                }`}
              >
                {ItemIcon && (
                  <ItemIcon
                    size={16}
                    aria-hidden="true"
                    className={`shrink-0 transition-colors duration-150 ${
                      destructive
                        ? "text-danger"
                        : "text-text-secondary group-hover:text-accent"
                    }`}
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.label}</span>
                  {item.description && (
                    <span className="block truncate text-xs text-text-secondary">
                      {item.description}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
