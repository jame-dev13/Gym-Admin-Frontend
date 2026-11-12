import {
  TableField,
  TableFieldGroup,
} from "@/components/table/TableField";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { Rating } from "@/components/rating/Rating";
import { CommentDetailsLink } from "@/features/comments/components/CommentDetailsLink";
import { CommentTableActionRows } from "@/features/comments/components/CommentTableActionRows";
import { useGetCommentPage } from "@/features/comments/hooks/api/useFetchComments";
import type {
  CommentResponse,
  CommentTableRow,
} from "@/features/comments/types";
import type { Column } from "@/types/Types";
import {
  CalendarClock,
  MessageSquareText,
  Star,
  Tag,
  UserRound,
} from "lucide-react";

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
  commentType.split("_").join(" ").toLowerCase();

const formatRate = (rate: number) => Math.round(rate * 5 * 100) / 100;

const COMMENT_TYPE_VARIANT: Record<
  CommentResponse["commentType"],
  BadgeVariant
> = {
  OPINION: "blue",
  SUGGESTION: "emerald",
  CRITIC: "rose",
};

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
          title={formatDate(createdAt)}
        >
          {formatDate(createdAt)}
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
        <TableField icon={Star} label="Rating" title={rate === null ? "Not rated" : `Rating: ${formatRate(rate)} out of 5`}>
          {rate === null ? (
            <span className="text-text-secondary">Not rated</span>
          ) : (
            <Rating
              value={rate}
              readOnly
              label={`Rating: ${formatRate(rate)} out of 5`}
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
