import { useCallback, useState, type FC } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
} from "lucide-react";
import type { SidebarProps } from "@/types/Props";
import type { NavbarLink } from "@/types/Types";

const linkBase =
  "flex w-auto items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-surface-over hover:text-accent tab:w-full";

const renderLinkIcon = (link: NavbarLink) =>
  link.Icon ? (
    <link.Icon size={20} aria-hidden="true" className="shrink-0" />
  ) : null;

export const Sidebar: FC<SidebarProps> = ({
  sections,
  brand,
  collapsedBrand,
  footer,
  defaultCollapsed = false,
  collapsed,
  onCollapsedChange,
  "aria-label": ariaLabel = "Sidebar",
  className = "",
}) => {
  if (sections.length === 0) {
    throw new Error("Sidebar requires at least one section");
  }

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isControlled = collapsed !== undefined;
  const isCollapsed = isControlled ? collapsed : internalCollapsed;

  const toggleCollapsed = useCallback(() => {
    const next = !isCollapsed;
    if (!isControlled) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  }, [isCollapsed, isControlled, onCollapsedChange]);

  const toggleLabel = isCollapsed ? "Expand sidebar" : "Collapse sidebar";

  const renderLink = (link: NavbarLink) => {
    const key = link.to ?? link.href;
    const content = (
      <>
        {renderLinkIcon(link)}
        {!isCollapsed && (
          <span className="whitespace-nowrap">{link.label}</span>
        )}
      </>
    );
    const title = isCollapsed ? link.label : undefined;
    return link.href !== undefined ? (
      <a key={key} href={link.href} title={title} className={`${linkBase} text-text-secondary`}>
        {content}
      </a>
    ) : (
      <NavLink
        key={key}
        to={link.to}
        title={title}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? "bg-surface-over text-accent" : "text-text-secondary"}`
        }
      >
        {content}
      </NavLink>
    );
  };

  return (
    <aside
      className={`sticky top-0 z-40 flex w-full flex-col border-b border-border bg-surface-raised text-text-primary tab:h-screen tab:border-b-0 tab:border-r tab:transition-[width] tab:duration-200 ${
        isCollapsed ? "tab:w-20" : "tab:w-64"
      } ${className}`}
    >
      <div
        className={`flex w-full shrink-0 flex-row items-center justify-between px-4 py-3 tab:w-auto tab:justify-start tab:border-b tab:border-border tab:py-4 ${
          isCollapsed ? "tab:justify-center" : ""
        }`}
      >
        {isCollapsed ? (collapsedBrand ?? brand) : brand}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          className={`${linkBase} shrink-0 text-text-secondary tab:hidden`}
        >
          {isCollapsed ? (
            <ChevronsUp size={20} aria-hidden="true" className="shrink-0" />
          ) : (
            <ChevronsDown size={20} aria-hidden="true" className="shrink-0" />
          )}
        </button>
      </div>

      <nav
        aria-label={ariaLabel}
        className={`min-w-0 flex-1 flex-row items-center gap-4 overflow-x-auto px-3 py-2 tab:min-h-0 tab:flex-col tab:items-stretch tab:gap-5 tab:overflow-x-visible tab:overflow-y-auto tab:py-4 ${
          isCollapsed ? "hidden tab:flex" : "flex"
        }`}
      >
        {sections.map((section, index) => (
          <div key={section.label ?? `section-${index}`} className="flex flex-row items-center gap-1 tab:flex-col tab:items-stretch">
            {section.label && !isCollapsed && (
              <p className="hidden px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary tab:block tab:sticky tab:top-0 tab:bg-surface-raised tab:py-1">
                {section.label}
              </p>
            )}
            {section.links.map(renderLink)}
          </div>
        ))}
      </nav>

      <div className="hidden shrink-0 flex-col gap-2 px-3 py-4 tab:flex">
        {footer && !isCollapsed && <div className="px-1">{footer}</div>}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          className={`${linkBase} text-text-secondary ${isCollapsed ? "justify-center px-0" : ""}`}
        >
          {isCollapsed ? (
            <ChevronsRight size={20} aria-hidden="true" className="shrink-0" />
          ) : (
            <>
              <ChevronsLeft size={20} aria-hidden="true" className="shrink-0" />
              <span className="whitespace-nowrap">Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
