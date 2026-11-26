import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ModalHost } from "@/components/modal/ModalHost";
import { ModalProvider } from "@/context/ModalProvider";
import { CreateCommentControl } from "@/features/comments/components/CreateCommentControl";

vi.mock("@/features/comments/components/CreateCurrentCommentForm", () => ({
  CreateCurrentCommentForm: () => <p>Create comment form content</p>,
}));

const renderControl = () =>
  render(
    <ModalProvider>
      <CreateCommentControl />
      <ModalHost />
    </ModalProvider>,
  );

describe("CreateCommentControl", () => {
  it("renders the add comment command button", () => {
    renderControl();

    expect(
      screen.getByRole("button", { name: "Add comment" }),
    ).toBeInTheDocument();
  });

  it("opens a modal that renders the lazy create form", async () => {
    const user = userEvent.setup();
    renderControl();

    await user.click(screen.getByRole("button", { name: "Add comment" }));

    expect(
      screen.getByRole("dialog", { name: "Add comment" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Create comment form content"),
    ).toBeInTheDocument();
  });

  it("disables the command while the modal is open", async () => {
    const user = userEvent.setup();
    renderControl();

    const button = screen.getByRole("button", { name: "Add comment" });
    await user.click(button);

    expect(button).toBeDisabled();
  });
});
