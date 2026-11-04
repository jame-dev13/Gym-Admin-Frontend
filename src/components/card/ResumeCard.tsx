import type { CardProps } from "@/components/card/types";
import { type FC } from "react";

export const ResumeCard: FC<CardProps> = ({
  Icon,
  footerText,
  children,
  className,
  heading,
}) => {
  return (
    <div
      className={`relative flex flex-col gap-3 bg-surface-raised/80 backdrop-blur-sm rounded-2xl border border-border/60 p-5 overflow-hidden transition-all duration-200 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 ${className}`}
    >
      <div className="absolute top-0 left-4 right-4 h-0.5 bg-linear-to-r from-accent to-blue-600 rounded-full" />
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {Icon && <Icon className="text-sm" size={15} />}
        </div>
        {heading && (
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent">
            {heading}
          </span>
        )}
      </div>
      {children}
      {footerText && (
        <footer className="flex place-items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent">
            {footerText}
          </span>
        </footer>
      )}
    </div>
  );
};
