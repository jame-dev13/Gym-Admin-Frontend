import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Rating } from "@/components/rating/Rating";
import { CommentDetailsLink } from "@/features/comments/components/CommentDetailsLink";
import { CommentListActionRows } from "@/features/comments/components/CommentListActionRows";
import { CommentReplySection } from "@/features/comments/components/CommentReplySection";
import {
  COMMENT_TYPE_VARIANT,
  formatCommentDate,
  formatCommentRate,
  formatCommentType,
} from "@/features/comments/services/comment-presentation";
import type { CommentResponse } from "@/features/comments/types";
import { CalendarClock, PencilLine } from "lucide-react";

export type CommentListItemProps = {
  comment: CommentResponse;
};

/**
 * The concrete item view for the comments list. It owns its layout and its
 * actions; `List`/`ListLayout` only space and scroll the items.
 */
export const CommentListItem = ({ comment }: CommentListItemProps) => {
  const createdAt = formatCommentDate(comment.createdAt);
  const editedAt = comment.editedAt
    ? formatCommentDate(comment.editedAt)
    : null;

  return (
    <article
      aria-label={`Comment from ${comment.from}`}
      className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-sm"
    >
      <header className="flex flex-col gap-3 tab:flex-row tab:items-start tab:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={comment.from} size="sm" />
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold capitalize text-text-primary"
              title={comment.from}
            >
              {comment.from}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
              <span className="inline-flex items-center gap-1">
                <CalendarClock size={12} aria-hidden="true" />
                {createdAt}
              </span>
              {editedAt && (
                <span className="inline-flex items-center gap-1">
                  <PencilLine size={12} aria-hidden="true" />
                  Edited {editedAt}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 tab:justify-end">
          <Badge
            variant={COMMENT_TYPE_VARIANT[comment.commentType]}
            leading="dot"
          >
            <span className="capitalize">
              {formatCommentType(comment.commentType)}
            </span>
          </Badge>
          {comment.rate === null ? (
            <span className="text-xs text-text-tertiary">Not rated</span>
          ) : (
            <Rating
              value={comment.rate}
              readOnly
              label={`Rating: ${formatCommentRate(comment.rate)} out of 5`}
            />
          )}
          <CommentListActionRows row={comment} />
        </div>
      </header>

      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-text-primary">
        {comment.comment || "—"}
      </p>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2">
        <CommentDetailsLink comment={comment} />
      </footer>

      {comment.hasReplies && (
        <CommentReplySection commentId={comment.commentId} />
      )}
    </article>
  );
};
