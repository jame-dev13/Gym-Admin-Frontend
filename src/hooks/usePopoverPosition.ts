import type { PopoverCoordinates } from "@/components/popover/PopoverTypes";
import { useLayoutEffect, useState } from "react";

const OFFSET = 8;
const VIEWPORT_MARGIN = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export const usePopoverPosition = (
  anchor: HTMLElement | null,
  panel: HTMLElement | null,
): PopoverCoordinates | null => {
  const [coordinates, setCoordinates] = useState<PopoverCoordinates | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!anchor || !panel) {
      return;
    }

    const update = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const spaceBelow =
        viewportHeight - anchorRect.bottom - OFFSET - VIEWPORT_MARGIN;
      const spaceAbove = anchorRect.top - OFFSET - VIEWPORT_MARGIN;
      const opensBelow =
        spaceBelow >= panelRect.height || spaceBelow >= spaceAbove;

      const top = clamp(
        opensBelow
          ? anchorRect.bottom + OFFSET
          : anchorRect.top - panelRect.height - OFFSET,
        VIEWPORT_MARGIN,
        viewportHeight - panelRect.height - VIEWPORT_MARGIN,
      );

      const left = clamp(
        anchorRect.left,
        VIEWPORT_MARGIN,
        viewportWidth - panelRect.width - VIEWPORT_MARGIN,
      );

      setCoordinates({
        top,
        left,
        placement: opensBelow ? "below" : "above",
      });
    };

    update();

    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [anchor, panel]);

  return coordinates;
};
