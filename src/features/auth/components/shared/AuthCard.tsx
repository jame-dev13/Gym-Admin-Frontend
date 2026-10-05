import type { AuthCardProps } from "@/types/Props";

const DEFAULT_ANIMATION = "animate-fade-in-up";

export const AuthCard = ({
  animationClassName = DEFAULT_ANIMATION,
  children,
  ...rest
}: AuthCardProps) => {
  return (
    <main className="flex w-full flex-1 min-h-screen place-content-center place-items-center overflow-hidden bg-surface p-4 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_55%)]">
      <article
        className={`${animationClassName} my-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-border bg-surface-raised p-8 shadow-2xl shadow-black/40`}
        {...rest}
      >
        {children}
      </article>
    </main>
  );
};