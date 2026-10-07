import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SortDirectionToggle } from "./SortDirectionToggle";

describe("SortDirectionToggle", () => {
  it("announces ascending state and the switch action", () => {
    render(<SortDirectionToggle direction="asc" />);

    expect(
      screen.getByRole("button", {
        name: "Sort direction: ascending, activate to sort descending",
      }),
    ).toBeInTheDocument();
  });

  it("announces descending state and the switch action", () => {
    render(<SortDirectionToggle direction="desc" />);

    expect(
      screen.getByRole("button", {
        name: "Sort direction: descending, activate to sort ascending",
      }),
    ).toBeInTheDocument();
  });

  it("toggles via onToggle and onChange with the next direction", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onChange = vi.fn();
    render(
      <SortDirectionToggle
        direction="asc"
        onToggle={onToggle}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /sort direction/i }),
    );

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("desc");
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<SortDirectionToggle direction="desc" onToggle={onToggle} />);

    screen
      .getByRole("button", { name: /sort direction/i })
      .focus();
    await user.keyboard("{Enter}");

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders compact by default and allows a larger size", () => {
    const { rerender } = render(<SortDirectionToggle direction="asc" />);

    expect(
      screen.getByRole("button", { name: /sort direction/i }).className,
    ).toMatch(/px-3 py-1\.5 text-xs/);

    rerender(<SortDirectionToggle direction="asc" size="md" />);

    expect(
      screen.getByRole("button", { name: /sort direction/i }).className,
    ).toMatch(/px-4 py-2\.5 text-sm/);
  });

  it("does nothing when disabled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<SortDirectionToggle direction="asc" onToggle={onToggle} disabled />);

    const toggle = screen.getByRole("button", { name: /sort direction/i });
    expect(toggle).toBeDisabled();
    await user.click(toggle);

    expect(onToggle).not.toHaveBeenCalled();
  });
});
