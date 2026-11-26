import type { CommentType } from "@/features/comments/types";
import type { SelectOption } from "@/types/Types";

/**
 * Options rendered by the comment type selector. The backend defines these
 * three values and rejects anything else.
 */
export const COMMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "OPINION" satisfies CommentType, label: "Opinion" },
  { value: "SUGGESTION" satisfies CommentType, label: "Suggestion" },
  { value: "CRITIC" satisfies CommentType, label: "Critic" },
];
