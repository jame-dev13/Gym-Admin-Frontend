import {
  TableField,
  TableFieldGroup,
} from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { Rating } from "@/components/rating/Rating";
import { CommentDetailsLink } from "@/features/comments/components/CommentDetailsLink";
import { CommentTableActionRows } from "@/features/comments/components/CommentTableActionRows";
import { useGetCommentPage } from "@/features/comments/hooks/api/useFetchComments";
import {
  COMMENT_TYPE_VARIANT,
  formatCommentDate,
  formatCommentRate,
  formatCommentType,
} from "@/features/comments/services/comment-presentation";
import type { CommentTableRow } from "@/features/comments/types";
import type { Column } from "@/types/Types";
import {
  CalendarClock,
  MessageSquareText,
  Star,
  Tag,
  UserRound,
} from "lucide-react";

const columns: Column<CommentTableRow>[] = [
  {
    kind: "data",
    key: "from",
    header: "From",
    render: (_, { from, createdAt }) => (
      <TableFieldGroup>
        <TableField icon={UserRound} label="From" title={`Comment from ${from}`}>
          <span className="capitalize">{from}</span>
        </TableField>
        <TableField
          icon={CalendarClock}
          label="Created at"
          title={formatCommentDate(createdAt)}
        >
          {formatCommentDate(createdAt)}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "comment",
    header: "Comment",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField
          icon={MessageSquareText}
          label="Comment"
          title={row.comment}
        >
          <span className="line-clamp-2">{row.comment || "—"}</span>
        </TableField>
        <TableField
          icon={MessageSquareText}
          label="Comment details"
          title="Open the full comment and its metadata"
        >
          <CommentDetailsLink comment={row} />
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "commentType",
    header: "Type & Rating",
    render: (_, { commentType, rate }) => (
      <TableFieldGroup>
        <TableField
          icon={Tag}
          label="Comment type"
          title={`Comment type: ${commentType}`}
          badge={COMMENT_TYPE_VARIANT[commentType]}
          leading="none"
        >
          <span className="capitalize">{formatCommentType(commentType)}</span>
        </TableField>
        <TableField icon={Star} label="Rating" title={rate === null ? "Not rated" : `Rating: ${formatCommentRate(rate)} out of 5`}>
          {rate === null ? (
            <span className="text-text-secondary">Not rated</span>
          ) : (
            <Rating
              value={rate}
              readOnly
              label={`Rating: ${formatCommentRate(rate)} out of 5`}
            />
          )}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "action",
    key: "Actions",
    header: "Actions",
    renderActions: (row) => <CommentTableActionRows row={row} />,
  },
];

const commentTableConfig: TableRendererConfig<CommentTableRow> = {
  usePage: useGetCommentPage,
  columns,
  title: "Comments",
  tableOptions: {
    "aria-label": "Comment's data Table",
    cardTitleKey: "from",
    getRowKey: (row) => row.commentId,
    emptyMessage: "Comments not found..",
    size: "sm",
    striped: true,
    responsive: "cards",
  },
  loadingMessage: "Loading comment's data",
  search: {
    enabled: true,
    placeholder: "Search in comments....",
  },
  sort: {
    properties: ["id", "from", "type", "creation"],
    initialSortBy: "creation",
    labels: {
      id: "Id",
      from: "From",
      type: "Type",
      creation: "Created at",
    },
    initialDirection: "desc",
  },
};

export const getCommentTableConfig = () => commentTableConfig;
