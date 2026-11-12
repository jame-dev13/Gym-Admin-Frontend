import type { Identifiable } from "@/types/Types";

/**
 * Backend-defined comment category.
 */
export type CommentType = "OPINION" | "SUGGESTION" | "CRITIC";

export type CommentResponse = Readonly<{
  commentId: string;
  from: string;
  comment: string;
  commentType: CommentType;
  rate: number | null;
  createdAt: string;
  editedAt: string | null;
}>;

export type CommentRequest = Readonly<{
  from: string;
  comment: string;
  commentType: CommentType;
  rate: number | null;
}>;

/**
 * `TableRenderer` rows must be `Identifiable`, while the API identifies
 * comments through `commentId`. The page hook maps `commentId` to `id`.
 */
export type CommentTableRow = CommentResponse & Identifiable;
