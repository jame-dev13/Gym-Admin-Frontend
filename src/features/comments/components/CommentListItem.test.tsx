import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ModalProvider } from "@/context/ModalProvider";
import { PopoverProvider } from "@/context/PopoverProvider";
import { CommentListItem } from "@/features/comments/components/CommentListItem";
import type { CommentResponse } from "@/features/comments/types";
import { renderWithProviders } from "@/test/test-utils";

const toComment = (hasReplies: boolean): CommentResponse => ({
  commentId: "comment-1",
  from: "Jane Doe",
  comment: "Great gym",
  commentType: "OPINION",
  rate: 4,
  createdAt: "2026-01-01T10:00:00.000Z",
  editedAt: null,
  hasReplies,
});

const renderItem = (comment: CommentResponse) =>
  renderWithProviders(
    <PopoverProvider>
      <ModalProvider>
        <CommentListItem comment={comment} />
      </ModalProvider>
    </PopoverProvider>,
  );

describe("CommentListItem", () => {
  it("offers the replies entry point when the comment has replies", () => {
    renderItem(toComment(true));

    expect(
      screen.getByRole("button", { name: "See more" }),
    ).toBeInTheDocument();
  });

  it("omits the replies entry point when the comment has no replies", () => {
    renderItem(toComment(false));

    expect(
      screen.queryByRole("button", { name: "See more" }),
    ).not.toBeInTheDocument();
  });
});
