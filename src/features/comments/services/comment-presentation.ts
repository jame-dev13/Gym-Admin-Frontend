import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import type { CommentResponse } from "@/features/comments/types";

export const formatCommentDate = (value: string | null): string => {
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

export const formatCommentType = (
  commentType: CommentResponse["commentType"],
): string => commentType.split("_").join(" ").toLowerCase();

export const formatCommentRate = (rate: number): number =>
  Math.round(rate * 5 * 100) / 100;

export const COMMENT_TYPE_VARIANT: Record<
  CommentResponse["commentType"],
  BadgeVariant
> = {
  OPINION: "blue",
  SUGGESTION: "emerald",
  CRITIC: "rose",
};
