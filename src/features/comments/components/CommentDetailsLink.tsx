import { PopoverLink } from "@/components/popover";
import { Rating } from "@/components/rating/Rating";
import type { CommentResponse } from "@/features/comments/types";
import { Eye } from "lucide-react";
import type { FC } from "react";

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const formatCommentType = (commentType: CommentResponse["commentType"]) =>
  commentType.toLowerCase();

const formatRate = (rate: number) => Math.round(rate * 5 * 100) / 100;

export const CommentDetailsLink: FC<{ comment: CommentResponse }> = ({
  comment,
}) => (
  <PopoverLink
    label="Comment details"
    data={comment}
    color="slate"
    render={(data) => (
      <div className="flex w-72 flex-col gap-3 rounded-2xl bg-surface-secondary p-3 text-sm">
        <p className="italic text-text-primary">{data.comment}</p>
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-text-secondary">From</dt>
            <dd className="font-semibold capitalize text-text-primary">
              {data.from}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-text-secondary">Type</dt>
            <dd className="font-semibold capitalize text-text-primary">
              {formatCommentType(data.commentType)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-text-secondary">Rating</dt>
            <dd className="text-text-primary">
              {data.rate === null ? (
                "Not rated"
              ) : (
                <Rating
                  value={data.rate}
                  readOnly
                  label={`Rating: ${formatRate(data.rate)} out of 5`}
                />
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-text-secondary">Created</dt>
            <dd className="text-text-primary">{formatDate(data.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-text-secondary">Edited</dt>
            <dd className="text-text-primary">{formatDate(data.editedAt)}</dd>
          </div>
        </dl>
      </div>
    )}
  >
    <Eye size={16} aria-hidden="true" />
    <span>See details</span>
  </PopoverLink>
);
