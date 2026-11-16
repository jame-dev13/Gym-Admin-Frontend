import { useEffect, useState } from "react";

/**
 * Tracks which in-page section is currently in the reading band so the
 * navbar can highlight the matching anchor. Falls back to no highlight when
 * IntersectionObserver is unavailable (SSR, very old browsers, tests).
 */
export const useActiveWelcomeSection = (sectionIds: readonly string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId ? `#${activeId}` : undefined;
};
