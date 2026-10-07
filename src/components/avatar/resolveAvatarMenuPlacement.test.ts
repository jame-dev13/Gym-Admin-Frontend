import { describe, expect, it } from "vitest";
import { resolveAvatarMenuPlacement } from "./resolveAvatarMenuPlacement";

describe("resolveAvatarMenuPlacement", () => {
  it("honors an explicit placement regardless of available space", () => {
    expect(
      resolveAvatarMenuPlacement(
        "bottom-start",
        { left: 300, right: 340 },
        360,
      ),
    ).toBe("bottom-start");
    expect(
      resolveAvatarMenuPlacement("bottom-end", { left: 8, right: 48 }, 360),
    ).toBe("bottom-end");
  });

  it("opens toward the right when the trigger sits on the left of a small viewport", () => {
    expect(
      resolveAvatarMenuPlacement("auto", { left: 8, right: 48 }, 360),
    ).toBe("bottom-start");
  });

  it("opens toward the left when the trigger sits on the right of a small viewport", () => {
    expect(
      resolveAvatarMenuPlacement("auto", { left: 300, right: 340 }, 360),
    ).toBe("bottom-end");
  });

  it("prefers the side with more room when both sides fit", () => {
    expect(
      resolveAvatarMenuPlacement("auto", { left: 400, right: 440 }, 1024),
    ).toBe("bottom-start");
    expect(
      resolveAvatarMenuPlacement("auto", { left: 700, right: 740 }, 1024),
    ).toBe("bottom-end");
  });

  it("falls back to bottom-end when the viewport width is unknown", () => {
    expect(resolveAvatarMenuPlacement("auto", { left: 8, right: 48 }, 0)).toBe(
      "bottom-end",
    );
    expect(
      resolveAvatarMenuPlacement("auto", { left: 8, right: 48 }, Number.NaN),
    ).toBe("bottom-end");
  });
});
