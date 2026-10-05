import { Dumbbell } from "lucide-react";
import type { AuthHeaderProps } from "@/types/Props";

export const AuthHeader = ({ title, subtitle, aside }: AuthHeaderProps) => {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-12 w-12 place-content-center place-items-center rounded-2xl bg-accent/10 ring-1 ring-accent/30">
        <Dumbbell size={26} className="text-accent" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h1
          id="auth-title"
          className="text-2xl font-bold tracking-tight text-text-primary"
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        {aside && (
          <p className="mt-2 text-sm text-text-secondary">{aside}</p>
        )}
      </div>
    </header>
  );
};