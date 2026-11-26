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
  comment: string;
  commentType: CommentType;
  rate: number | null;
}>;

export type CommentTableRow = CommentResponse & Identifiable;
