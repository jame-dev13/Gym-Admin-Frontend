import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { CommentReplySection } from "@/features/comments/components/CommentReplySection";
import type { ReplyResponse } from "@/features/comments/types";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import type { Slice } from "@/types/Types";

const REPLIES_URI = "*/comments/current/:commentId/replies";

const toReply = (id: string): ReplyResponse => ({
  replyId: id,
  replyFrom: `Author ${id}`,
  replyText: `Reply ${id}`,
  createdAt: "2026-01-01T10:00:00.000Z",
});

const toSlice = (
  content: ReplyResponse[],
  { number, last }: { number: number; last: boolean },
): Slice<ReplyResponse> => ({
  content,
  number,
  size: 2,
  numberOfElements: content.length,
  first: number === 0,
  last,
  empty: content.length === 0,
});

const useReplySlices = () => {
  const slices = [
    toSlice([toReply("1"), toReply("2")], { number: 0, last: false }),
    toSlice([toReply("3")], { number: 1, last: true }),
  ];

  server.use(
    http.get(REPLIES_URI, ({ request }) => {
      const number = Number(
        new URL(request.url).searchParams.get("number") ?? 0,
      );

      return HttpResponse.json(
        slices[number] ?? toSlice([], { number, last: true }),
      );
    }),
  );
};

const renderSection = () =>
  renderWithProviders(<CommentReplySection commentId="comment-1" />);

describe("CommentReplySection", () => {
  it("keeps the replies collapsed until the user asks for them", () => {
    renderSection();

    expect(
      screen.getByRole("button", { name: "See more" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("Replies")).not.toBeInTheDocument();
  });

  it("loads a slice of replies and appends the next one on demand", async () => {
    useReplySlices();
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole("button", { name: "See more" }));

    expect(await screen.findByText("Reply 1")).toBeInTheDocument();
    expect(screen.getByText("Reply 2")).toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: "See more replies" }),
    );

    expect(await screen.findByText("Reply 3")).toBeInTheDocument();
    expect(screen.getByText("Reply 1")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "See more replies" }),
      ).not.toBeInTheDocument();
    });
  });

  it("hides the replies when the section is collapsed again", async () => {
    useReplySlices();
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole("button", { name: "See more" }));
    await screen.findByText("Reply 1");

    await user.click(screen.getByRole("button", { name: "Hide replies" }));

    expect(screen.queryByText("Reply 1")).not.toBeInTheDocument();
  });
});
