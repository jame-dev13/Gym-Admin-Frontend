import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SortDropdown } from "./SortDropdown";
import type { SortOption } from "@/types/Types";

const options: SortOption<"name" | "date">[] = [
  { value: "name", label: "Name", description: "Sort by member name" },
  { value: "date", label: "Start date" },
];

describe("SortDropdown", () => {
  it("renders the placeholder accessibly when nothing is selected", () => {
    render(<SortDropdown options={options} />);

    expect(
      screen.getByRole("button", { name: "Sort by" }),
    ).toBeInTheDocument();
  });

  it("lists every sort property when opened", async () => {
    const user = userEvent.setup();
    render(<SortDropdown options={options} />);

    await user.click(screen.getByRole("button", { name: "Sort by" }));
    const menu = screen.getByRole("menu");

    expect(
      within(menu).getByRole("menuitemradio", { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitemradio", { name: /start date/i }),
    ).toBeInTheDocument();
  });

  it("notifies the selected value and shows it as the trigger", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SortDropdown options={options} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Sort by" }));
    await user.click(
      screen.getByRole("menuitemradio", { name: /start date/i }),
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("date");
  });

  it("supports controlled value", async () => {
    const user = userEvent.setup();
    render(<SortDropdown options={options} value="name" />);

    await user.click(screen.getByRole("button", { name: "Name" }));

    expect(
      screen.getByRole("menuitemradio", { name: /name/i }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<SortDropdown options={options} disabled />);

    const trigger = screen.getByRole("button", { name: "Sort by" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders compact by default and allows a larger size", () => {
    const { rerender } = render(<SortDropdown options={options} />);

    expect(screen.getByRole("button", { name: "Sort by" }).className).toMatch(
      /px-3 py-1\.5 text-xs/,
    );

    rerender(<SortDropdown options={options} size="md" />);

    expect(screen.getByRole("button", { name: "Sort by" }).className).toMatch(
      /px-4 py-2\.5 text-sm/,
    );
  });

  it("throws when options are empty", () => {
    expect(() => render(<SortDropdown options={[]} />)).toThrow(
      "SortDropdown requires at least one option",
    );
  });
});
