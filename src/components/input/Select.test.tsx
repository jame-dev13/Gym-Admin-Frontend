import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";
import type { SelectOption } from "@/types/Types";

const options: SelectOption[] = [
  { value: "admin", label: "Administrator" },
  { value: "trainer", label: "Trainer" },
  { value: "member", label: "Member", disabled: true },
];

describe("Select", () => {
  it("renders a labeled select with all options", () => {
    render(<Select label="Role" name="role" options={options} />);
    const select = screen.getByRole("combobox", { name: "Role" });
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Trainer" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Member" })).toBeInTheDocument();
  });

  it("shows the placeholder as the initial selection", () => {
    render(<Select label="Role" name="role" options={options} />);
    const select = screen.getByRole("combobox", { name: "Role" });
    expect(select).toHaveValue("");
    expect(
      screen.getByRole("option", { name: "Select an option" }),
    ).toBeInTheDocument();
  });

  it("supports a custom placeholder", () => {
    render(
      <Select
        label="Role"
        name="role"
        options={options}
        placeholder="Choose a role"
      />,
    );
    expect(
      screen.getByRole("option", { name: "Choose a role" }),
    ).toBeInTheDocument();
  });

  it("updates the selection in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Select label="Role" name="role" options={options} />);
    const select = screen.getByRole("combobox", { name: "Role" });

    await user.selectOptions(select, "trainer");

    expect(select).toHaveValue("trainer");
  });

  it("respects a controlled value", () => {
    render(
      <Select
        label="Role"
        name="role"
        options={options}
        value="admin"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("combobox", { name: "Role" })).toHaveValue("admin");
  });

  it("forwards the native change event to the parent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select label="Role" name="role" options={options} onChange={onChange} />,
    );

    await user.selectOptions(screen.getByRole("combobox", { name: "Role" }), "admin");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe("admin");
  });

  it("marks disabled options as unavailable", () => {
    render(<Select label="Role" name="role" options={options} />);
    expect(screen.getByRole("option", { name: "Member" })).toBeDisabled();
  });

  it("passes name and required through to the native select", () => {
    render(<Select label="Role" name="role" options={options} required />);
    const select = screen.getByRole("combobox", { name: "Role" });
    expect(select).toHaveAttribute("name", "role");
    expect(select).toBeRequired();
  });

  it("exposes an error accessibly", () => {
    render(
      <Select
        label="Role"
        name="role"
        options={options}
        error="Role is required"
      />,
    );
    const select = screen.getByRole("combobox", { name: "Role" });
    expect(select).toHaveAttribute("aria-invalid", "true");
    const message = screen.getByText("Role is required");
    expect(message).toBeInTheDocument();
    expect(select).toHaveAccessibleDescription("Role is required");
  });

  it("associates a description accessibly", () => {
    render(
      <Select
        label="Role"
        name="role"
        options={options}
        description="Determines dashboard access"
      />,
    );
    expect(
      screen.getByRole("combobox", { name: "Role" }),
    ).toHaveAccessibleDescription("Determines dashboard access");
  });

  it("renders a disabled empty state when there are no options", () => {
    render(<Select label="Role" name="role" options={[]} />);
    const select = screen.getByRole("combobox", { name: "Role" });
    expect(select).toBeDisabled();
    expect(
      screen.getByRole("option", { name: "No options available" }),
    ).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(<Select label="Role" name="role" options={options} disabled />);
    expect(screen.getByRole("combobox", { name: "Role" })).toBeDisabled();
  });
});
