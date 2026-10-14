import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserConfirmDialog } from "@/features/user/components/UserConfirmDialog";

type SubmitCapture = {
  preventDefault: () => void;
  formData: FormData | null;
};

function createSubmitMock(capture: SubmitCapture) {
  return vi.fn().mockImplementation((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    capture.preventDefault = e.preventDefault;
    const form = e.currentTarget as HTMLFormElement;
    capture.formData = new FormData(form);
  });
}

describe("UserConfirmDialog", () => {
  it("confirms the recover action", async () => {
    const user = userEvent.setup();
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    render(
      <UserConfirmDialog
        variant="recover"
        onConfirmSubmit={createSubmitMock(capture)}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Recover user" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "recover dialog confirm button." }));
    expect(capture.formData).not.toBeNull();
  });

  it("warns that hard-delete cannot be undone", () => {
    render(
      <UserConfirmDialog
        variant="hard-delete"
        onConfirmSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText("Permanently delete user")).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  it("disables actions and exposes errors accessibly", async () => {
    const user = userEvent.setup();
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    render(
      <UserConfirmDialog
        variant="delete"
        isPending
        error="Users could not be saved"
        onConfirmSubmit={createSubmitMock(capture)}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "delete dialog confirm button." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Users could not be saved",
    );

    await user.click(screen.getByRole("button", { name: "delete dialog confirm button." }));
    expect(capture.formData).toBeNull();
  });
});
