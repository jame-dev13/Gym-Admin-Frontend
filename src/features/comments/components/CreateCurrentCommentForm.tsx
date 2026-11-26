import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { CheckboxInput } from "@/components/input/CheckboxInput";
import { Select } from "@/components/input/Select";
import { Rating } from "@/components/rating/Rating";
import { useModalContext } from "@/context/useModalContext";
import { useCreateCurrentCommentHandler } from "@/features/comments/hooks/handlers/useCreateCurrentCommentHandler";
import { COMMENT_TYPE_OPTIONS } from "@/features/comments/services/comment-form-config";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { useState, type FC } from "react";

export const CreateCurrentCommentForm: FC = () => {
  const { closeModal } = useModalContext();
  const { submit, error, isPending } = useCreateCurrentCommentHandler();
  const [rate, setRate] = useState<number>(0);
  const [isNotRated, setIsNotRated] = useState(false);

  return (
    <AppForm noValidate={true} onSubmit={submit}>
      <Fieldset legend={"New comment"}>
        <label
          htmlFor={"create-current-comment-body"}
          className={"flex w-full flex-col gap-2 font-serif"}
        >
          <span className={"text-sm font-medium text-text-secondary"}>
            Comment
          </span>
          <textarea
            id={"create-current-comment-body"}
            name={"comment"}
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
          options={COMMENT_TYPE_OPTIONS}
          required={true}
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
          Icon={MessageSquarePlus}
          isPending={isPending}
          disabled={isPending}
          pendingLabel={"Creating..."}
          aria-label={"Comment create form submit button"}
        >
          Create comment
        </SubmitBtn>
      </footer>
    </AppForm>
  );
};
