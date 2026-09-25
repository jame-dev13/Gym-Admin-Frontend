import type { CSSProperties, FC, ReactNode } from "react";
import { useRevealOnScroll } from "@/features/landing-page/hooks/useRevealOnScroll";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export const Reveal: FC<RevealProps> = ({ children, delay = 0, className = "" }) => {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
