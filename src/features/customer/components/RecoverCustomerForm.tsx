import { SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useRecoverCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { AlertCircle, UserRoundArrowLeft } from "lucide-react";
import { type FC } from "react";

type RecoverCustomerFormProps = { email: string };

export const RecoverCustomerForm: FC<RecoverCustomerFormProps> = ({
  email,
}) => {
  const { showError, showSuccess } = useToastFactory();
  const { submit, isPending } = useMutationHandler({
    mutationHook: useRecoverCustomer,
    payloadBuilder: () => ({ email: email }),
    resultHandlers: {
      onSuccess: () => showSuccess(`Customer recovered with success.`),
      onError: (err) =>
        showError(`Customer could not be recovered: ${err?.message}`),
    },
  });

  return (
    <AppForm onSubmit={submit}>
      <Fieldset legend="Recover customer">
        <AlertCircle />
        <p className="italic">
          Are you sure you want to re-activate this customer?
        </p>
      </Fieldset>
      <SubmitBtn
        isPending={isPending}
        Icon={UserRoundArrowLeft}
        aria-label="Recover user button"
        disabled={isPending || !email}
        pendingLabel="Bringing back customer..."
      >
        Recover
      </SubmitBtn>
    </AppForm>
  );
};
