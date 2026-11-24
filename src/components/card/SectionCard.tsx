import type { PropsWithChildren } from "@/components/form/FormTypes";
import { Component } from "lucide-react";

type SectionCardProps = PropsWithChildren & {
  heading: string;
  description?: string;
  Icon: typeof Component;
  className?: string
};

export const SectionCard = ({
  children,
  heading,
  description,
  Icon,
  className
}: SectionCardProps) => (
  <article className={`flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 backdrop-blur-sm shadow-sm ${className}`}>
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="text-sm" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
          {heading}
        </h2>
        {description && (
          <p className="text-xs text-text-tertiary">{description}</p>
        )}
      </div>
    </div>
    {children}
  </article>
);
