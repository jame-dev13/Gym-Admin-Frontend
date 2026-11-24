import { describe, expect, it } from "vitest";
import {
  clampNotificationRange,
  isValidNotificationRange,
  toNotificationRangeSelection,
} from "@/features/notification/services/notification-range";

describe("notification-range", () => {
  it("validates only whole values inside the backend bounds", () => {
    expect(isValidNotificationRange(3)).toBe(true);
    expect(isValidNotificationRange(7)).toBe(true);
    expect(isValidNotificationRange(2)).toBe(false);
    expect(isValidNotificationRange(8)).toBe(false);
    expect(isValidNotificationRange(4.5)).toBe(false);
    expect(isValidNotificationRange(null)).toBe(false);
  });

  it("clamps values into the backend bounds", () => {
    expect(clampNotificationRange(1)).toBe(3);
    expect(clampNotificationRange(9)).toBe(7);
    expect(clampNotificationRange(5.6)).toBe(6);
    expect(clampNotificationRange(Number.NaN)).toBe(3);
  });

  it("maps preset values to preset mode and the rest to custom mode", () => {
    expect(toNotificationRangeSelection(3)).toEqual({
      mode: "preset",
      days: 3,
    });
    expect(toNotificationRangeSelection(5)).toEqual({
      mode: "preset",
      days: 5,
    });
    expect(toNotificationRangeSelection(6)).toEqual({
      mode: "custom",
      days: 6,
    });
    expect(toNotificationRangeSelection(7)).toEqual({
      mode: "custom",
      days: 7,
    });
    expect(toNotificationRangeSelection(10)).toEqual({
      mode: "custom",
      days: 7,
    });
  });
});
