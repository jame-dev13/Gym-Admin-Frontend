import type { ReactNode } from "react";

/**
 * A single slide in the carousel. `content` can be an image, a chart, or any
 * other React node, which keeps the component domain-agnostic.
 */
export interface CarousellItem {
  /** Stable key used to identify the slide across renders. */
  id: string;
  /** Accessible name for the slide and caption shown in the controls. */
  label: string;
  /** Slide body: image, chart, card, or any other component. */
  content: ReactNode;
  /**
   * Adds the default inner spacing. Disable it for full-bleed media such as
   * images or videos.
   */
  padded?: boolean;
  /**
   * Extra classes for the slide wrapper. Use it for media sizing, e.g.
   * `aspect-video` for images or a fixed height for embedded content.
   */
  className?: string;
}

export interface CarousellProps {
  items: CarousellItem[];
  /** Index of the slide shown on the first render. */
  initialIndex?: number;
  /**
   * Wraps navigation from the last slide to the first one and vice versa.
   * @default true
   */
  loop?: boolean;
  /**
   * Advances the carousel automatically. Pauses on hover, on focus, when the
   * tab is hidden, and when the user prefers reduced motion.
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Delay between automatic slide changes, in milliseconds.
   * @default 5000
   */
  autoPlayInterval?: number;
  /** Called with the new index every time the active slide changes. */
  onIndexChange?: (index: number) => void;
  /**
   * Renders the navigation footer (arrows, dots, slide caption, and autoplay
   * toggle when enabled). Swipe and keyboard navigation stay available.
   * Autoplay requires this footer so the pause control is always reachable.
   * @default true
   */
  showControls?: boolean;
  /** Accessible name for the carousel region. */
  "aria-label"?: string;
  className?: string;
}
