import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EmailInput, PasswordInput } from "./Input";

describe("EmailInput", () => {
  it("renders a labeled email field", () => {
    render(<EmailInput name="email" />);
    expect(screen.getByLabelText("Email input")).toBeInTheDocument();
  });

  it("captures user input", async () => {
    const user = userEvent.setup();
    render(<EmailInput name="email" />);

    const field = screen.getByLabelText("Email input");
    await user.type(field, "user@example.com");

    expect(field).toHaveValue("user@example.com");
  });
});

describe("PasswordInput", () => {
  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<PasswordInput name="password" />);

    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Button show/hide password"));

    expect(field).toHaveAttribute("type", "text");
  });
});
