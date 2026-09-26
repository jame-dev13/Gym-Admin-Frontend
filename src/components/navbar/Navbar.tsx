import { useCallback, useEffect, useId, useRef, useState, type FC } from "react";
import { NavLink } from "react-router-dom";
import { BurgerBtn } from "@/components/buttons/Buttons";
import type { NavbarProps } from "@/types/Props";
import type { NavbarLink, NavbarPosition } from "@/types/Types";

const positionClasses: Record<NavbarPosition, string> = {
  static: "static",
  sticky: "sticky top-0 z-40",
  fixed: "fixed inset-x-0 top-0 z-40",
};

const desktopLinkBase =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-accent";

const mobileLinkBase =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-text-secondary transition-colors duration-200 hover:bg-surface-over hover:text-accent";

export const Navbar: FC<NavbarProps> = ({
  links,
  brand,
  position = "sticky",
  defaultOpen = false,
  open,
  onOpenChange,
  "aria-label": ariaLabel = "Main navigation",
  className = "",
}) => {
  if (links.length === 0) {
    throw new Error("Navbar requires at least one link");
  }

  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const menuOpen = isControlled ? open : internalOpen;

  const setMenuOpen = useCallback(
    (next: boolean, refocusBurger = false) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
      if (refocusBurger) {
        burgerRef.current?.focus();
      }
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false, true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, setMenuOpen]);

  const renderLinkIcon = (link: NavbarLink) =>
    link.Icon ? <link.Icon size={18} aria-hidden="true" /> : null;

  const renderDesktopLink = (link: NavbarLink) =>
    link.href !== undefined ? (
      <a
        key={link.href}
        href={link.href}
        className={`${desktopLinkBase} text-text-secondary`}
      >
        {renderLinkIcon(link)}
        {link.label}
      </a>
    ) : (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `${desktopLinkBase} ${isActive ? "text-accent" : "text-text-secondary"}`
        }
      >
        {renderLinkIcon(link)}
        {link.label}
      </NavLink>
    );

  const renderMobileLink = (link: NavbarLink) =>
    link.href !== undefined ? (
      <a
        key={link.href}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className={mobileLinkBase}
      >
        {renderLinkIcon(link)}
        <span>{link.label}</span>
      </a>
    ) : (
      <NavLink
        key={link.to}
        to={link.to}
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) =>
          `${mobileLinkBase} ${isActive ? "text-accent" : ""}`
        }
      >
        {renderLinkIcon(link)}
        <span>{link.label}</span>
      </NavLink>
    );

  return (
    <header
      className={`border-b border-border bg-surface text-text-primary ${positionClasses[position]} ${className}`}
    >
      <nav aria-label={ariaLabel} className="flex items-center justify-between gap-4 px-4 py-3">
        {brand && <div className="flex min-w-0 items-center gap-2">{brand}</div>}
        <div className="hidden items-center gap-1 tab:flex">
          {links.map(renderDesktopLink)}
        </div>
        <BurgerBtn
          open={menuOpen}
          controlsId={menuId}
          onToggle={() => setMenuOpen(!menuOpen)}
          buttonRef={burgerRef}
        />
      </nav>
      {menuOpen && (
        <div id={menuId} className="border-t border-border px-4 py-3 tab:hidden animate-fade-in-scale">
          <div className="flex flex-col gap-1">
            {links.map(renderMobileLink)}
          </div>
        </div>
      )}
    </header>
  );
};
