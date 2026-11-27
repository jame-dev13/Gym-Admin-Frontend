import type { ListRendererConfig } from "@/components/list/listRendererConfig";
import type { ListItem } from "@/components/list/ListTypes";
import { CommentListItem } from "@/features/comments/components/CommentListItem";
import { CreateCommentControl } from "@/features/comments/components/CreateCommentControl";
import {
  useGetCommunityCommentPage,
  useGetCurrentCommentPage,
} from "@/features/comments/hooks/api/useFetchCurrentComments";
import type {
  CommentResponse,
  CommunityCommentResponse,
} from "@/features/comments/types";

const commentCurrentListItem: ListItem<CommentResponse> = {
  render: (comment) => <CommentListItem comment={comment} kind={"current"} />,
};

const commentCommunityListItem: ListItem<CommunityCommentResponse> = {
  render: (comment) => <CommentListItem comment={comment} kind={"community"} />,
};

const commentListConfig: ListRendererConfig<CommentResponse> = {
  usePage: useGetCurrentCommentPage,
  item: commentCurrentListItem,
  title: "Comments",
  listOptions: {
    "aria-label": "Comments list",
    emptyMessage: "Comments not found..",
    getItemKey: (comment) => comment.commentId,
    gap: "md",
  },
  controls: <CreateCommentControl />,
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
      creation: "CreatedAt",
    },
    initialDirection: "desc",
  },
};

export const getCommentListConfig = () => commentListConfig;

export const getCommunityCommentListConfig =
  (): ListRendererConfig<CommunityCommentResponse> =>
    Object.seal({
      ...commentListConfig,
      usePage: useGetCommunityCommentPage,
      item: commentCommunityListItem,
    });
