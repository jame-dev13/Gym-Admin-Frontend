import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserConfirmDialog } from "@/features/user/components/UserConfirmDialog";

describe("UserConfirmDialog", () => {
  it("confirms the recover action", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <UserConfirmDialog
        variant="recover"
        userName="Ada Admin"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Recover user" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Recover user" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("warns that hard-delete cannot be undone", () => {
    render(
      <UserConfirmDialog
        variant="hard-delete"
        userName="Ada Admin"
        onConfirm={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Permanently delete user" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  it("disables actions and exposes errors accessibly", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <UserConfirmDialog
        variant="delete"
        userName="Ada Admin"
        isPending
        error="Users could not be saved"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /deleting/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Users could not be saved",
    );

    await user.click(screen.getByRole("button", { name: /deleting/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
