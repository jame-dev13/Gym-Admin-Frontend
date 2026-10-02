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

describe("PasswordInput error", () => {
  it("exposes an error accessibly and highlights the field", () => {
    render(<PasswordInput name="password" error="Passwords do not match" />);

    const field = screen.getByLabelText("Password");
    const message = screen.getByText("Passwords do not match");

    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAttribute("aria-describedby", message.id);
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(field.className).toMatch(/border-danger/);
  });

  it("renders no error state without the error prop", () => {
    render(<PasswordInput name="password" />);

    const field = screen.getByLabelText("Password");

    expect(field).not.toHaveAttribute("aria-invalid");
    expect(
      screen.queryByText("Passwords do not match"),
    ).not.toBeInTheDocument();
  });
});
