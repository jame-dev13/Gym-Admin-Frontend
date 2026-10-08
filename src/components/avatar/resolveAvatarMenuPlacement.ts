import type { DropdownPlacement, AvatarMenuPlacement } from "@/components/dropdown/DropdownTypes";

/** Panel width in px (w-64) plus a viewport safety margin. */
const PANEL_WIDTH_PX = 256;
const VIEWPORT_MARGIN_PX = 16;

export function resolveAvatarMenuPlacement(
  preferred: AvatarMenuPlacement,
  triggerRect: { left: number; right: number },
  viewportWidth: number,
): DropdownPlacement {
  if (preferred !== "auto") {
    return preferred;
  }
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) {
    return "bottom-end";
  }
  const fitsStart =
    triggerRect.left + PANEL_WIDTH_PX + VIEWPORT_MARGIN_PX <= viewportWidth;
  const fitsEnd = triggerRect.right - PANEL_WIDTH_PX - VIEWPORT_MARGIN_PX >= 0;
  if (fitsStart && !fitsEnd) {
    return "bottom-start";
  }
  if (fitsEnd && !fitsStart) {
    return "bottom-end";
  }
  // Fits both sides, or neither: align toward the side with more room.
  return viewportWidth - triggerRect.left >= triggerRect.right
    ? "bottom-start"
    : "bottom-end";
}
