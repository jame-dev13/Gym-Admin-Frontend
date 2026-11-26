import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModalProvider } from "@/context/ModalProvider";
import { CreateCurrentCommentForm } from "@/features/comments/components/CreateCurrentCommentForm";
import { useCreateCurrentCommentHandler } from "@/features/comments/hooks/handlers/useCreateCurrentCommentHandler";

vi.mock(
  "@/features/comments/hooks/handlers/useCreateCurrentCommentHandler",
  () => ({
    useCreateCurrentCommentHandler: vi.fn(),
  }),
);

const submit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) =>
  event.preventDefault(),
);

const renderForm = () =>
  render(
    <ModalProvider>
      <CreateCurrentCommentForm />
    </ModalProvider>,
  );

describe("CreateCurrentCommentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateCurrentCommentHandler).mockReturnValue({
      submit,
      isPending: false,
      error: null,
    });
  });

  it("renders the create fields", () => {
    renderForm();

    expect(
      screen.getByRole("group", { name: "New comment" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Comment")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Comment type selector." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Comment rating" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Not rated" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Comment create form submit button" }),
    ).toBeInTheDocument();
  });

  it("submits the form through the create handler", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Comment"), "Great gym!");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Comment type selector." }),
      "SUGGESTION",
    );
    await user.click(
      screen.getByRole("button", { name: "Comment create form submit button" }),
    );

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("disables the rating when the comment is marked as not rated", async () => {
    const user = userEvent.setup();
    renderForm();

    const rating = screen.getByRole("slider", { name: "Comment rating" });
    expect(rating).not.toHaveAttribute("aria-disabled");

    await user.click(screen.getByRole("checkbox", { name: "Not rated" }));

    expect(rating).toHaveAttribute("aria-disabled", "true");
  });

  it("exposes the pending state and errors accessibly", () => {
    vi.mocked(useCreateCurrentCommentHandler).mockReturnValue({
      submit: vi.fn(),
      isPending: true,
      error: { message: "Cannot create comment" },
    });

    renderForm();

    const submitButton = screen.getByRole("button", {
      name: "Comment create form submit button",
    });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByText("Creating...")).toBeInTheDocument();
    expect(screen.getByText("Cannot create comment")).toBeInTheDocument();
  });
});
