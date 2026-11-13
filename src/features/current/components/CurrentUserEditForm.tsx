import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { useUpdateCurrentUserInfoHandler } from "@/features/current/hooks/handlers/useUpdateCurrentUserInfoHandler";
import { getUpdateCurrentFormConfig } from "@/features/current/services/current-user-form-config";
import type { CurrentUserResponse } from "@/features/current/types";
import { ArrowLeft, Save } from "lucide-react";
import { Fragment, type FC } from "react";

type CurrentUserEditFormProps = {
  user: CurrentUserResponse;
  onCancel: () => void;
  onExit: () => void;
};

const config = getUpdateCurrentFormConfig();

export const CurrentUserEditForm: FC<CurrentUserEditFormProps> = ({
  user,
  onCancel,
  onExit,
}) => {
  const { submit, error, isPending } = useUpdateCurrentUserInfoHandler(onExit);
  return (
    <AppForm noValidate={true} onSubmit={submit}>
      <Fieldset legend={"Info"}>
        {config.map(({ Field, label, key, required, name, getValue }) => (
          <Fragment key={key}>
            <Field
              labelText={label}
              required={required}
              name={name}
              defaultValue={getValue?.(user)}
            />
          </Fragment>
        ))}
        {error && (
          <p className={"text-danger text-sm"} aria-live={"polite"}>
            {error.message}
          </p>
        )}
      </Fieldset>
      <footer className={"divide-y divide-olive-600 inline-flex w-full"}>
        <SubmitBtn
          Icon={Save}
          disabled={isPending}
          pendingLabel={"Saving..."}
          isPending={isPending}
          aria-label={"Submit form update current info button."}
        >
          Save
        </SubmitBtn>
        <CommandBtn
          Icon={ArrowLeft}
          title={"Cancel"}
          disabled={isPending}
          aria-label={"Cancel update current info form button"}
          onClick={onCancel}
        >
          Cancel
        </CommandBtn>
      </footer>
    </AppForm>
  );
};
