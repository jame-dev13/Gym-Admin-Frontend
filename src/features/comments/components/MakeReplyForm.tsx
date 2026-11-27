import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { TextArea } from "@/components/text-area/TextArea";
import { useModalContext } from "@/context/useModalContext";
import { useCreateReplyHandler } from "@/features/comments/hooks/handlers/useCreateReplyHandler";
import { type FC } from "react";

type MakeReplyFormProps = {
  commentId: string;
};

const MakeReplyForm: FC<MakeReplyFormProps> = ({ commentId }) => {
  const { closeModal } = useModalContext();
  const { submit, isPending } = useCreateReplyHandler(commentId);
  return (
    <AppForm onSubmit={submit}>
      <Fieldset legend={"Reply"}>
        <TextArea
          id={"make-reply-comment-body"}
          textAreaName={"comment"}
          required={true}
          rows={4}
        />
      </Fieldset>
      <SubmitBtn
        disabled={isPending}
        isPending={isPending}
        pendingLabel={"Making reply...."}
        aria-label={"Make reply button."}
      >
        Make
      </SubmitBtn>
      <CommandBtn onClick={closeModal} aria-label={"Close modal button"}>
        Cancel
      </CommandBtn>
    </AppForm>
  );
};

export default MakeReplyForm;
