import { MessageSquarePlus } from "lucide-react";
import { lazy } from "react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useModalContext } from "@/context/useModalContext";

const LazyCreateCurrentCommentForm = lazy(() =>
  import("@/features/comments/components/CreateCurrentCommentForm").then(
    (mod) => ({
      default: mod.CreateCurrentCommentForm,
    }),
  ),
);

export const CreateCommentControl = () => {
  const { isOpen: isModalOpen, openModal } = useModalContext();

  const handleAdd = () => {
    openModal({
      title: "Add comment",
      description: "Create a new comment.",
      size: "md",
      data: null,
      render: () => <LazyCreateCurrentCommentForm />,
    });
  };

  return (
    <CommandBtn
      Icon={MessageSquarePlus}
      onClick={handleAdd}
      aria-label={"Add comment"}
      title={"Add comment"}
      iconOnly
      disabled={isModalOpen}
    >
      Add comment
    </CommandBtn>
  );
};
