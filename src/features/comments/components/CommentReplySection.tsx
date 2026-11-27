import { ListSkeleton } from "@/components/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import { lazy, Suspense, useId, useState } from "react";

const LazyCommentReplyList = lazy(() =>
  import("@/features/comments/components/CommentReplyList").then((mod) => ({
    default: mod.CommentReplyList,
  })),
);

export type CommentReplySectionProps = {
  commentId: string;
};

export const CommentReplySection = ({
  commentId,
}: CommentReplySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const repliesId = useId();

  return (
    <section aria-label="Comment replies" className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={repliesId}
        aria-label={isOpen ? "Hide replies" : "See more"}
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent/10 hover:text-accent-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {isOpen ? (
          <ChevronUp size={16} aria-hidden="true" />
        ) : (
          <ChevronDown size={16} aria-hidden="true" />
        )}
        {isOpen ? "Hide replies" : "See more"}
      </button>

      {isOpen && (
        <div
          id={repliesId}
          className="border-l-2 border-border/70 pl-3 tab:pl-4"
        >
          <Suspense
            fallback={
              <ListSkeleton
                items={2}
                linesPerItem={2}
                aria-label="Loading comment replies"
              />
            }
          >
            <LazyCommentReplyList key={commentId} commentId={commentId} />
          </Suspense>
        </div>
      )}
    </section>
  );
};
