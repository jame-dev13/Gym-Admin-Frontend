import type { ReactNode } from "react";
import type { BadgeProps, BadgeVariant } from "./BadgeTypes";

type BadgePalette = {
  root: string;
  dot: string;
  initial: string;
};

const variantClasses: Record<BadgeVariant, BadgePalette> = {
  accent: {
    root: "border-accent bg-accent/10",
    dot: "bg-accent-emphasis",
    initial: "bg-accent-emphasis text-surface",
  },
  indigo: {
    root: "border-indigo-600 bg-indigo-600/10",
    dot: "bg-indigo-600",
    initial: "bg-indigo-600 text-white",
  },
  slate: {
    root: "border-slate-600 bg-slate-600/10",
    dot: "bg-slate-600",
    initial: "bg-slate-600 text-white",
  },
  rose: {
    root: "border-rose-600 bg-rose-600/10",
    dot: "bg-rose-600",
    initial: "bg-rose-600 text-white",
  },
  blue: {
    root: "border-blue-600 bg-blue-600/10",
    dot: "bg-blue-600",
    initial: "bg-blue-600 text-white",
  },
  emerald: {
    root: "border-emerald-600 bg-emerald-600/10",
    dot: "bg-emerald-600",
    initial: "bg-emerald-600 text-white",
  },
  amber: {
    root: "border-amber-600 bg-amber-600/10",
    dot: "bg-amber-600",
    initial: "bg-amber-600 text-white",
  },
  purple: {
    root: "border-purple-600 bg-purple-600/10",
    dot: "bg-purple-600",
    initial: "bg-purple-600 text-white",
  },
};

const rootStyles = [
  "inline-flex",
  "items-center-safe",
  "w-fit",
  "min-w-0",
  "max-w-full",
  "gap-2",
  "rounded-full",
  "border",
  "px-2.5",
  "py-1.5",
  "text-left",
  "align-middle",
  "font-medium",
].join(" ");


const dotStyles = "size-[0.7em] shrink-0 rounded-full";

const initialStyles = [
  "inline-flex",
  "size-[1.5em]",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-full",
  "font-semibold",
  "uppercase",
].join(" ");


const initialLetterStyles = "text-[0.6em]";

const labelStyles = "min-w-0 truncate";

function resolveInitial(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children).charAt(0);
  }

  throw new Error('Badge with leading="initial" requires string or number children');
}

export const Badge = ({
  children,
  variant = "accent",
  leading = "dot",
  mono = false,
  title,
  className = "",
}: BadgeProps) => {
  const palette = variantClasses[variant];

  return (
    <span
      title={title}
      className={[rootStyles, palette.root, mono ? "font-mono" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {leading === "dot" && (
        <span aria-hidden="true" className={`${dotStyles} ${palette.dot}`} />
      )}

      {leading === "initial" && (
        <span aria-hidden="true" className={`${initialStyles} ${palette.initial}`}>
          <span className={initialLetterStyles}>{resolveInitial(children)}</span>
        </span>
      )}

      <span className={labelStyles}>{children}</span>
    </span>
  );
};
