import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { CheckboxInput } from "@/components/input/CheckboxInput";
import { Select } from "@/components/input/Select";
import { Rating } from "@/components/rating/Rating";
import { useModalContext } from "@/context/useModalContext";
import { useEditCurrentCommentHandler } from "@/features/comments/hooks/handlers/useEditCurrentCommentHandler";
import { COMMENT_TYPE_OPTIONS } from "@/features/comments/services/comment-form-config";
import type { CommentResponse } from "@/features/comments/types";
import { ArrowLeft, Save } from "lucide-react";
import { useState, type FC } from "react";

export type EditCurrentCommentFormProps = {
  comment: CommentResponse;
};

export const EditCurrentCommentForm: FC<EditCurrentCommentFormProps> = ({
  comment,
}) => {
  const { closeModal } = useModalContext();
  const { submit, error, isPending } = useEditCurrentCommentHandler(
    comment.commentId,
  );
  const [rate, setRate] = useState<number>(comment.rate ?? 0);
  const [isNotRated, setIsNotRated] = useState(comment.rate === null);

  return (
    <AppForm noValidate={true} onSubmit={submit}>
      <Fieldset legend={"Comment"}>
        <label
          htmlFor={"edit-current-comment-body"}
          className={"flex w-full flex-col gap-2 font-serif"}
        >
          <span className={"text-sm font-medium text-text-secondary"}>
            Comment
          </span>
          <textarea
            id={"edit-current-comment-body"}
            name={"comment"}
            defaultValue={comment.comment}
            rows={4}
            required={true}
            className={
              "w-full resize-y rounded-lg border border-border bg-transparent px-3 py-2 text-sm tracking-wide text-text-primary outline-none transition-colors focus:border-accent focus:ring-0"
            }
          />
        </label>
        <Select
          label={"Type"}
          name={"commentType"}
          defaultValue={comment.commentType}
          options={COMMENT_TYPE_OPTIONS}
          aria-label={"Comment type selector."}
        />
        <div className={"flex w-full flex-col gap-2"}>
          <span className={"text-sm font-medium text-text-secondary"}>
            Rating
          </span>
          <Rating
            value={rate}
            onChange={setRate}
            disabled={isNotRated}
            name={"rate"}
            label={"Comment rating"}
            size={"md"}
          />
          <CheckboxInput
            label={"Not rated"}
            name={"notRated"}
            checked={isNotRated}
            onChange={(event) => setIsNotRated(event.currentTarget.checked)}
            description={"Leave this comment without a rating."}
          />
        </div>
        {error && (
          <p className={"text-sm text-danger"} aria-live={"polite"}>
            {error.message}
          </p>
        )}
      </Fieldset>
      <footer className={"inline-flex w-full justify-end gap-2"}>
        <CommandBtn Icon={ArrowLeft} onClick={closeModal} disabled={isPending}>
          Cancel
        </CommandBtn>
        <SubmitBtn
          Icon={Save}
          isPending={isPending}
          disabled={isPending}
          pendingLabel={"Saving..."}
        >
          Save
        </SubmitBtn>
      </footer>
    </AppForm>
  );
};
