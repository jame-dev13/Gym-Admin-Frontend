import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShieldCheck } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders the provided copy and submits the form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
    });

    render(
      <ConfirmDialog
        title="Restore customer"
        description="The customer will regain access to the application."
        confirmLabel="Restore customer"
        pendingLabel="Restoring…"
        Icon={ShieldCheck}
        onConfirmSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Restore customer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The customer will regain access to the application."),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Restore customer" }),
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the actions and exposes the error and pending label", () => {
    render(
      <ConfirmDialog
        title="Delete customer"
        description="The customer will be removed."
        confirmLabel="Delete customer"
        pendingLabel="Deleting…"
        tone="destructive"
        isPending
        error="The customer could not be deleted"
        onConfirmSubmit={vi.fn()}
        onCancel={vi.fn()}
        confirmAriaLabel="delete customer dialog confirm button."
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "delete customer dialog confirm button.",
      }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "The customer could not be deleted",
    );
    expect(screen.getByText("Deleting…")).toBeInTheDocument();
  });

  it("omits the cancel action when no handler is provided", () => {
    render(
      <ConfirmDialog
        title="Delete customer"
        description="The customer will be removed."
        confirmLabel="Delete customer"
        pendingLabel="Deleting…"
        onConfirmSubmit={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument();
  });

  it("cancels without submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        title="Recover customer"
        description="The customer will regain access."
        confirmLabel="Recover customer"
        pendingLabel="Recovering…"
        onConfirmSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
