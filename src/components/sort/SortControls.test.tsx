import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SortControls } from "./SortControls";
import { SortDirectionToggle } from "./SortDirectionToggle";
import { SortDropdown } from "./SortDropdown";

const options = [
  { value: "name", label: "Name" },
  { value: "date", label: "Start date" },
] as const;

describe("SortControls", () => {
  it("groups the dropdown and direction toggle under one accessible name", async () => {
    const user = userEvent.setup();
    render(
      <SortControls label="Sort members">
        <SortDropdown options={[...options]} />
        <SortDirectionToggle direction="asc" />
      </SortControls>,
    );

    const group = screen.getByRole("group", { name: "Sort members" });
    expect(group).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sort by" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("keeps both controls working together through the hook-style props", async () => {
    const user = userEvent.setup();
    const onField = vi.fn();
    const onToggle = vi.fn();
    render(
      <SortControls aria-label="Sort controls">
        <SortDropdown options={[...options]} onChange={onField} />
        <SortDirectionToggle direction="asc" onToggle={onToggle} />
      </SortControls>,
    );

    expect(
      screen.getByRole("group", { name: "Sort controls" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /sort direction/i }),
    );
    expect(onToggle).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Sort by" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Name" }));
    expect(onField).toHaveBeenCalledWith("name");
  });
});
