import { useEffect, useRef, useState } from "react";

type RevealState<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  visible: boolean;
};

export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(): RevealState<T> {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (visible) {
      return;
    }
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  return { ref, visible };
}
