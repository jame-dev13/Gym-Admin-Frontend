import { useState } from "react";
import { UserPlus, Save } from "lucide-react";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { CommandBtn, SubmitBtn } from "@/components/buttons/Buttons";
import { CheckboxInput } from "@/components/input/CheckboxInput";
import { EmailInput, PasswordInput, TextInput } from "@/components/input/Input";
import { Select } from "@/components/input/Select";
import {
  AUTH_PROVIDER_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/features/user/services/userFormOptions";
import {
  validateUserCreate,
  validateUserUpdate,
  type UserFormErrors,
} from "@/features/user/services/userFormValidation";
import type {
  UserRequest,
  UserUpdateRequest,
} from "@/features/user/types";

type UserFormBase = {
  isPending?: boolean;
  serverError?: string | null;
  onCancel?: () => void;
};

export type UserFormProps =
  | (UserFormBase & {
      mode: "create";
      initialValues?: Partial<UserRequest>;
      onSubmit: (values: UserRequest) => void;
    })
  | (UserFormBase & {
      mode: "update";
      initialValues?: Partial<UserUpdateRequest>;
      onSubmit: (values: UserUpdateRequest) => void;
    });

const readRoles = (form: HTMLFormElement): string[] =>
  Array.from(new FormData(form).getAll("roles"))
    .map((role) => String(role).trim())
    .filter(Boolean);

export const UserForm = (props: UserFormProps) => {
  const { mode, initialValues, isPending = false, serverError, onCancel } = props;
  const [errors, setErrors] = useState<UserFormErrors>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const roles = readRoles(form);

    if (mode === "create") {
      const password = String(data.get("password") ?? "");
      const authProvider = String(data.get("authProvider") ?? "");
      const validation = validateUserCreate({
        name,
        email,
        password,
        authProvider,
        roles,
      });
      setErrors(validation);
      if (Object.keys(validation).length > 0) return;
      const provider = authProvider as UserRequest["authProvider"];
      if (
        provider !== "LOCAL" &&
        provider !== "GOOGLE" &&
        provider !== "FACEBOOK"
      ) {
        return;
      }
      props.onSubmit({
        name,
        email,
        password,
        authProvider: provider,
        roles,
      });
      return;
    }

    const validation = validateUserUpdate({ name, email, roles });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    props.onSubmit({ name, email, roles });
  };

  const initialRoles = initialValues?.roles ?? [];

  return (
    <AppForm onSubmit={handleSubmit} noValidate className="gap-5">
      <Fieldset legend={mode === "create" ? "New user" : "Edit user"}>
        <TextInput
          name="name"
          labelText="Name"
          autoComplete="name"
          defaultValue={initialValues?.name ?? ""}
          disabled={isPending}
          error={errors.name}
        />
        <EmailInput
          name="email"
          autoComplete="email"
          defaultValue={initialValues?.email ?? ""}
          disabled={isPending}
          error={errors.email}
        />
        {mode === "create" && (
          <>
            <PasswordInput
              name="password"
              autoComplete="new-password"
              disabled={isPending}
              error={errors.password}
            />
            <Select
              name="authProvider"
              label="Auth provider"
              options={[...AUTH_PROVIDER_OPTIONS]}
              defaultValue={
                (props.initialValues?.authProvider as string | undefined) ??
                "LOCAL"
              }
              required
              disabled={isPending}
              error={errors.authProvider}
            />
          </>
        )}
        <fieldset>
          <legend className="text-sm font-medium text-text-primary">
            Roles
          </legend>
          <p className="text-sm text-text-secondary">
            Select at least one role for this user.
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {USER_ROLE_OPTIONS.map((option) => (
              <CheckboxInput
                key={option.value}
                name="roles"
                value={option.value}
                label={option.label}
                defaultChecked={initialRoles.includes(option.value)}
                disabled={isPending}
              />
            ))}
          </div>
          {errors.roles && (
            <p role="alert" className="text-sm text-danger">
              {errors.roles}
            </p>
          )}
        </fieldset>
      </Fieldset>

      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <CommandBtn type="button" onClick={onCancel} disabled={isPending}>
            Cancel
          </CommandBtn>
        )}
        <SubmitBtn
          Icon={mode === "create" ? UserPlus : Save}
          disabled={isPending}
        >
          {mode === "create" ? "Create user" : "Save changes"}
        </SubmitBtn>
      </div>
    </AppForm>
  );
};
