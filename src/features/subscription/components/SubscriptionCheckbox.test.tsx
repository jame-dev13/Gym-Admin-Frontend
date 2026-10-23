import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SubscriptionCheckbox } from "./SubscriptionCheckbox";

const LABEL =
  "I confirm that the customer has paid for this change and that I am authorized to proceed.";

describe("SubscriptionCheckbox", () => {
  it("renders the payment confirmation and reports toggles", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <SubscriptionCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: LABEL });
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeRequired();

    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);

    rerender(
      <SubscriptionCheckbox checked onCheckedChange={onCheckedChange} />,
    );
    expect(checkbox).toBeChecked();
  });

  it("supports action-specific messages", () => {
    render(
      <SubscriptionCheckbox
        checked={false}
        onCheckedChange={vi.fn()}
        label="I confirm that the customer authorized this action."
        description="Only continue once the authorization has been verified."
      />,
    );

    expect(
      screen.getByRole("checkbox", {
        name: "I confirm that the customer authorized this action.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Only continue once the authorization has been verified."),
    ).toBeInTheDocument();
  });

  it("respects the disabled and error states", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <SubscriptionCheckbox
        checked={false}
        onCheckedChange={onCheckedChange}
        disabled
        error="Payment confirmation is required."
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: LABEL });
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByText("Payment confirmation is required."),
    ).toBeInTheDocument();

    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
