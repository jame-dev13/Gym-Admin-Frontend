import { SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { EmailInput } from "@/components/input/Input";
import { useHandleRecoveryRequest } from "@/features/auth/hooks/recovery";
import { Plane } from "lucide-react";
import { type FC } from "react";

type RecoveryRequestFormProps = {
  emailRef: { current: string };
  onSuccess: () => void;
};

export const RecoveryRequestForm: FC<RecoveryRequestFormProps> = ({
  emailRef,
  onSuccess,
}) => {
  const { handleSubmit, isPending } = useHandleRecoveryRequest(
    emailRef,
    onSuccess,
  );
  return (
    <AppForm onSubmit={handleSubmit}>
      <Fieldset legend="Recovery Request">
        <div className="flex flex-col gap-4">
          <EmailInput name="email" labelText="Email" required />
        </div>
      </Fieldset>
      <SubmitBtn
        Icon={Plane}
        aria-label="Request recovery code button"
        disabled={isPending}
      >
        Send
      </SubmitBtn>
    </AppForm>
  );
};
