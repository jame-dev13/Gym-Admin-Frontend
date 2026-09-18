import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxInput } from "./CheckboxInput";

describe("CheckboxInput", () => {
  it("renders a labeled checkbox", () => {
    render(<CheckboxInput name="terms" label="Accept terms" />);
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    ).toBeInTheDocument();
  });

  it("toggles and forwards the native change event to the parent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CheckboxInput name="terms" label="Accept terms" onChange={onChange} />,
    );

    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).not.toBeChecked();

    await user.click(box);

    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports controlled checked state", () => {
    render(
      <CheckboxInput
        name="terms"
        label="Accept terms"
        checked
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeChecked();
  });

  it("exposes error accessibly", () => {
    render(
      <CheckboxInput name="terms" label="Accept terms" error="Required field" />,
    );
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets the indeterminate property", () => {
    render(
      <CheckboxInput name="terms" label="Accept terms" indeterminate />,
    );
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement,
    ).toHaveProperty("indeterminate", true);
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CheckboxInput
        name="terms"
        label="Accept terms"
        disabled
        onChange={onChange}
      />,
    );

    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).toBeDisabled();
    await user.click(box);
    expect(onChange).not.toHaveBeenCalled();
  });
});
