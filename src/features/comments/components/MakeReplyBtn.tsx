import { CommandBtn } from "@/components/buttons/Buttons";
import { useModalContext } from "@/context/useModalContext";
import type { CommentRow } from "@/features/comments/types";
import { MessageCirclePlus } from "lucide-react";
import { lazy, type FC } from "react";

type MakeReplyBtnProps = {
  comment: CommentRow;
};

const LazyMakeReplyForm = lazy(
  () => import("@/features/comments/components/MakeReplyForm"),
);

export const MakeReplyBtn: FC<MakeReplyBtnProps> = ({ comment }) => {
  const { isOpen, openModal } = useModalContext();

  const handleOpenModal = () =>
    openModal({
      data: comment,
      title: "Make a Reply",
      description: `Replying to: ${comment.from}`,
      size: "md",
      render: (comment) => <LazyMakeReplyForm commentId={comment.commentId} />,
    });

  return (
    <CommandBtn
      onClick={handleOpenModal}
      Icon={MessageCirclePlus}
      disabled={isOpen || !comment}
      title={"open comment reply button form."}
      aria-label={"Open make comment reply button form."}
      iconOnly
    >
      {""}
    </CommandBtn>
  );
};
