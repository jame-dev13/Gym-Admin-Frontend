import { Avatar } from "@/components/avatar/Avatar";
import { CommandBtn } from "@/components/buttons/Buttons";
import { ListSkeleton } from "@/components/skeleton";
import { useGetCommentReplySlice } from "@/features/comments/hooks/api/useFetchCurrentComments";
import { formatCommentDate } from "@/features/comments/services/comment-presentation";
import type { ReplyResponse } from "@/features/comments/types";
import { MessageSquare, RefreshCw } from "lucide-react";
import { useState } from "react";

const REPLY_SLICE_SIZE = 4;

const DEFAULT_ERROR_MESSAGE = "The replies could not be loaded.";

export type CommentReplyListProps = {
  commentId: string;
};

const CommentReplyItem = ({ reply }: { reply: ReplyResponse }) => (
  <article
    aria-label={`Reply from ${reply.replyFrom}`}
    className="flex min-w-0 gap-3 rounded-lg border border-border/70 bg-surface p-3"
  >
    <Avatar name={reply.replyFrom} size="sm" />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <p
          className="truncate text-sm font-semibold capitalize text-text-primary"
          title={reply.replyFrom}
        >
          {reply.replyFrom}
        </p>
        <time dateTime={reply.createdAt} className="text-xs text-text-tertiary">
          {formatCommentDate(reply.createdAt)}
        </time>
      </div>
      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-text-primary">
        {reply.replyText || "—"}
      </p>
    </div>
  </article>
);

type CommentReplySliceProps = {
  commentId: string;
  number: number;
  isLast: boolean;
  onLoadMore: () => void;
};

/**
 * One requested slice of the thread. Every loaded slice owns its query, so
 * appending a new slice never re-fetches or copies the previous ones.
 */
const CommentReplySlice = ({
  commentId,
  number,
  isLast,
  onLoadMore,
}: CommentReplySliceProps) => {
  const { data, error, isPending, refetch } = useGetCommentReplySlice(
    commentId,
    { number, size: REPLY_SLICE_SIZE },
  );

  if (isPending) {
    return (
      <ListSkeleton
        items={2}
        linesPerItem={2}
        aria-label="Loading comment replies"
      />
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
      >
        <p>{error.message ?? DEFAULT_ERROR_MESSAGE}</p>
        <CommandBtn
          Icon={RefreshCw}
          onClick={() => void refetch()}
          aria-label="Retry loading replies"
        >
          Retry
        </CommandBtn>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const replies = data.content;

  if (replies.length === 0) {
    return number === 0 ? (
      <p className="text-sm text-text-tertiary">No replies yet.</p>
    ) : null;
  }

  const hasMore = !data.last;

  return (
    <div className="flex flex-col gap-3">
      <ul
        aria-label={number === 0 ? "Replies" : "More replies"}
        className="flex flex-col gap-3"
      >
        {replies.map((reply) => (
          <li key={reply.replyId}>
            <CommentReplyItem reply={reply} />
          </li>
        ))}
      </ul>

      {isLast && hasMore && (
        <div className="flex justify-center">
          <CommandBtn
            Icon={MessageSquare}
            onClick={onLoadMore}
            aria-label="See more replies"
            title="See more replies"
          >
            See more replies
          </CommandBtn>
        </div>
      )}
    </div>
  );
};

/**
 * Incremental replies thread: each "See more replies" click mounts the next
 * slice, and every slice renders its own fetched content.
 */
export const CommentReplyList = ({ commentId }: CommentReplyListProps) => {
  const [sliceCount, setSliceCount] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: sliceCount }, (_, number) => (
        <CommentReplySlice
          key={number}
          commentId={commentId}
          number={number}
          isLast={number === sliceCount - 1}
          onLoadMore={() => setSliceCount((current) => current + 1)}
        />
      ))}
    </div>
  );
};
